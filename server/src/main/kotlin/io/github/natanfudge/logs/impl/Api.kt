package io.github.natanfudge.logs.impl

import io.github.natanfudge.logs.impl.analytics.Analytics
import io.github.natanfudge.logs.impl.analytics.AnalyticsArchive
import io.github.natanfudge.logs.impl.analytics.DayBreakdown
import io.github.natanfudge.logs.impl.analytics.startOfDayGmt
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.pipeline.*
import io.objectbox.Box
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.Json
import java.time.Instant
import java.time.ZonedDateTime
import kotlin.math.ceil

internal class Router(private val box: Box<LogEventEntity>, private val analyticsArchive: AnalyticsArchive) {
    context(Routing)
    fun routeApi() {
        endpoint("endpoints") {
            val endpoints = box.query().build().use {
                it.property(LogEventEntity_.name).distinct().findStrings()
            }.toList()


            call.respondText(json.encodeToString(ListSerializer(String.serializer()), endpoints))
        }

        endpoint("logs") {
            val params = call.parameters
            val request = UrlParameters.decodeSafelyFromParameters(call.parameters, GetLogsRequest.serializer())
                .getOrElse {
                    call.respondText("Malformed request: ${it.message}", status = HttpStatusCode.BadRequest)
                    return@endpoint
                }


            // Get logs with the specified endpoint in the specified days
            val logs: List<LogEventEntity> = box.query(
                LogEventEntity_.name.equal(request.endpoint)
                    .and(LogEventEntity_.startTime.between(request.startDate, request.endDate))
            ).build().use { it.find() }

            val fittingLogs = logs.sortedByDescending { it.startTime }
                .map { it.toLogEvent() }
                .filter {
                    when (it.getSeverity()) {
                        LogLine.Severity.Error -> request.allowError
                        LogLine.Severity.Warn -> request.allowWarn
                        LogLine.Severity.Info -> request.allowInfo
                    }
                }

            val response = LogResponse(
                pageCount = ceil(fittingLogs.size.toDouble() / PageSize).toInt(),
                // Return only PageSize items, and skip pages before the requested page
                logs = fittingLogs.drop(request.page * PageSize).take(PageSize).toList()
            )
            println(params)

            call.respondText(json.encodeToString(LogResponse.serializer(), response))
        }
        endpoint("analytics") {
            val request = UrlParameters.decodeSafelyFromParameters(call.parameters, GetAnalyticsRequest.serializer())
                .getOrElse {
                    call.respondText("Malformed request: ${it.message}", status = HttpStatusCode.BadRequest)
                    return@endpoint
                }

            val realtime = getRealtimeAnalytics(request.endpoint)
            val archived = analyticsArchive.getAll(request.endpoint)
            val all = realtime + archived
            // We go one day earlier to include the first day itself
            val start = ZonedDateTime.ofInstant(Instant.ofEpochMilli(request.startDate), GMTZoneId).minusDays(1)
                .toInstant()
            val end = Instant.ofEpochMilli(request.endDate)
            val requestedDayRange: GetAnalyticsResponse = all.mapKeys { (day, _) -> day.startOfDayGmt() }
                .filterKeys { instant -> instant.isBefore(end) && instant.isAfter(start) }
                .mapKeys { (instant, _) -> instant.toEpochMilli() }

            call.respondText(
                json.encodeToString(
                    MapSerializer(Long.serializer(), DayBreakdown.serializer()),
                    requestedDayRange
                )
            )
        }
    }

    private fun getRealtimeAnalytics(endpoint: String): Analytics {
        return box.query(LogEventEntity_.name.equal(endpoint)).build().use { it.find() }.analyze()
    }
}


private fun Routing.endpoint(name: String, config: suspend PipelineContext<Unit, ApplicationCall>.() -> Unit) =
    get("__log_viewer__/$name") {
        addCorsHeader()
        config()
    }

@Serializable
internal data class GetLogsRequest(
    val endpoint: String,
    val startDate: Long,
    val endDate: Long,
    val page: Int,
    val allowError: Boolean,
    val allowWarn: Boolean,
    val allowInfo: Boolean
//    val filter: GetLogsFilter
)

@Serializable
internal data class GetLogsFilter(val info: Boolean, val warn: Boolean, val error: Boolean)

@Serializable
internal data class GetAnalyticsRequest(
    val endpoint: String,
    val startDate: Long,
    val endDate: Long,
)

// Map from unixms of day to breakdown
internal typealias GetAnalyticsResponse = Map<Long, DayBreakdown>


private fun PipelineContext<Unit, ApplicationCall>.addCorsHeader() {
    // This makes it easier to test out the api in development since the React app runs in port 3000
    call.response.header("Access-Control-Allow-Origin", "*")
}


private const val PageSize = 18


private val json = Json { encodeDefaults = true }


@Serializable
internal data class LogResponse(
    val pageCount: Int,
    val logs: List<LogEvent>
)