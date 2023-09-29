package io.github.natanfudge.logs.impl

import io.github.natanfudge.logs.LogContext
import io.github.natanfudge.logs.Loggy
import io.github.natanfudge.logs.impl.analytics.AnalyticsArchive
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import io.objectbox.Box
import io.objectbox.kotlin.boxFor
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import java.nio.file.Path
import java.time.Instant
import java.time.ZonedDateTime
import java.util.*
import kotlin.concurrent.schedule
import kotlin.io.path.createDirectories

public class LoggingCredentials(
    internal val username: CharArray,
    internal val password: CharArray
)

internal class FancyLogger(
    private val logToConsole: Boolean,
    logsDir: Path,
    private val credentials: LoggingCredentials
) : Loggy {
    private val boxStore = MyObjectBox.builder()
        .directory(logsDir.toFile())
        .build()

    private val analyticsArchive = AnalyticsArchive(logsDir.resolve("archive/analytics").createDirectories())

    @PublishedApi
    internal val logsBox: Box<LogEventEntity> = boxStore.boxFor<LogEventEntity>()

    init {
        logsDir.createDirectories()
    }

    context(Application)
    override fun install() {
        installAuthentication(credentials)
        scheduleOldLogDeletion()
    }

    @OptIn(DelicateCoroutinesApi::class)
    private fun scheduleOldLogDeletion() {
        val timer = Timer()
        // Runs once every day and once at startup
        timer.schedule(delay = 0, period = DayMs) {
            GlobalScope.launch(Dispatchers.IO) {
                startCall("loggy_cleanup") {
                    logData("Time") { Instant.now() }
                    evictOld()
                }
            }
        }
    }

    context(LogContext)
    private fun evictOld() {
        // Query for all logs more than a month old and remove them
        val monthAgo = ZonedDateTime.now().minusMonths(1).toEpochSecond() * 1000
        logsBox.query(LogEventEntity_.startTime.less(monthAgo)).build().use {
            // We save a minimal amount of information for later analysis
            archiveMinimalAnalyticalInfo(it.find())
            logData("Log Size") { (boxStore.sizeOnDisk() / 1000).toString() + "KB" }
            val removed = it.remove()
            logData("Logs Removed") { removed }
        }
    }

    context(LogContext)
    private fun archiveMinimalAnalyticalInfo(toBeDestroyed: List<LogEventEntity>) {
        val breakdown = toBeDestroyed
            .groupBy { it.name }
            .mapValues { (_, logs) -> logs.analyze() }

        for ((endpoint, analytics) in breakdown) {
            analyticsArchive.append(endpoint, analytics)
        }
    }


    context(Routing)
    override fun route() {
        routeAuthentication()
        authenticate(AuthSessionName) {
            Router(logsBox, analyticsArchive).routeApi()
            routeReactApp()
        }
    }

    private fun Route.routeReactApp() {
        singlePageApplication {
            useResources = true
            filesPath = "__log_viewer__/static"
            defaultPage = "index.html"
            applicationRoute = "/logs"
        }
    }


    override fun <T> startCall(name: String, call: LogContext.() -> T): T {
        return startCallWithContextAsParam(name, call)
    }

    override suspend fun <T> startSuspend(name: String, call: suspend LogContext.() -> T): T {
        return startCallWithContextAsParam(name) { call(it) }
    }

    // Context receivers are bugging out, so we pass LogContext as a parameter for some use cases
    // (try removing this with K2)
    @Suppress("OVERRIDE_BY_INLINE")
    override inline fun <T> startCallWithContextAsParam(name: String, call: (LogContext) -> T): T {
        val lowercaseName = name.lowercase()
        if (lowercaseName.startsWith("debug") || lowercaseName == "all" || lowercaseName == "") {
            throw IllegalArgumentException("The endpoint name '$name' is reserved by loggy. Please use a different endpoint name.")
        }
        val context = LogContext(name.removePrefix("/").replace("/", "_"), Instant.now())
        val value = try {
            call(context)
        } catch (e: Throwable) {
            context.logError(e) { "Unexpected error handling '$name'" }
            throw e
        } finally {
            storeLog(context)
        }
        return value
    }

    override suspend fun <T> startSuspendWithContextAsParam(name: String, call: suspend (LogContext) -> T): T {
        return startCallWithContextAsParam(name) { call(it) }
    }


//    override fun <T> startCallWithContextAsParam(name: String, call: (LogContext) -> T): T {
//        val context = LogContext(name.removePrefix("/").replace("/", "_"), Instant.now())
//        val value = try {
//            call(context)
//        } catch (e: Throwable) {
//            context.logError(e) { "Unexpected error handling '$name'" }
//            throw e
//        } finally {
//            storeLog(context)
//        }
//        return value
//    }

    @PublishedApi
    internal fun storeLog(context: LogContext) {
        val log = context.buildLog()
        if (log.logs.isNotEmpty()) {
            logsBox.put(log.toObjectBox())
            if (logToConsole) ConsoleLogRenderer.render(log)
        }
    }

}


internal const val LoginPath = "/_log_viewer/login"
private const val DayMs = 1000 * 60 * 60 * 24L

