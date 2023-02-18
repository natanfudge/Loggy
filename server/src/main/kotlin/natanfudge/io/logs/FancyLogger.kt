package natanfudge.io.logs

import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import io.objectbox.Box
import io.objectbox.kotlin.boxFor
import java.nio.file.Path
import java.time.Instant
import kotlin.io.path.createDirectories

//TODO automatic eviction

public class FancyLogger(public val logToConsole: Boolean, logsDir: Path) {
    private val boxStore = MyObjectBox.builder()
        .directory(logsDir.toFile())
        .build()

    @PublishedApi
    internal val logsBox: Box<ObjectBoxLogEvent> = boxStore.boxFor<ObjectBoxLogEvent>()

    init {
        logsDir.createDirectories()
    }

    public inline fun <T> startCall(name: String, call: LogContext.() -> T): T {
        return startCallWithContextAsParam(name, call)
    }

    // Context receivers are bugging out, so we pass LogContext as a parameter for some use cases
    // (try removing this with K2)
    public inline fun <T> startCallWithContextAsParam(name: String, call: (LogContext) -> T): T {
        val context = LogContext(name, Instant.now())
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

    @PublishedApi
    internal fun storeLog(context: LogContext) {
        val log = context.buildLog()
        if (log.logs.isNotEmpty()) {
            logsBox.put(log.toObjectBox())
            if (logToConsole) ConsoleLogRenderer.render(log)
        }
    }


    context(Routing)
    public fun route() {
        logViewerApi(logsBox)
        static("/logs") {
            staticBasePackage = "__log_viewer__/static"
            resources(".")
            defaultResource("index.html")
        }
    }
}


public class LogContext(private val name: String, private val startTime: Instant) {
    @PublishedApi
    internal val logDetails: MutableList<LogLine> = mutableListOf()

    public inline fun logInfo(message: () -> String) {
        logDetails.add(LogLine.Message.Normal(message(), Instant.now(), LogLine.Severity.Info))
    }

    public inline fun logWarn(message: () -> String) {
        logDetails.add(LogLine.Message.Normal(message(), Instant.now(), LogLine.Severity.Warn))
    }

    public inline fun logError(exception: Throwable, message: () -> String) {
        logDetails.add(LogLine.Message.Error(message(), Instant.now(), exception.toSerializable()))
    }

    public inline fun logData(key: String, value: () -> Any) {
        logDetails.add(LogLine.Detail(key, value().toString()))
    }

    @PublishedApi
    internal fun buildLog(): LogEvent = LogEvent(
        name, startTime = startTime, endTime = Instant.now(), logDetails
    )
}