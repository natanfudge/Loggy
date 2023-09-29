package io.github.natanfudge.logs.impl

import com.caesarealabs.searchit.SearchitResult
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
            val request = UrlParameters.decodeSafelyFromParameters(call.parameters, GetLogsRequest.serializer())
                .getOrElse {
                    call.respondText("Malformed request: ${it.message}", status = HttpStatusCode.BadRequest)
                    return@endpoint
                }

            val result = box.loggySearch(request)
            println("Returning $result for request $request")
            call.respondText(json.encodeToString(GetLogsResponse.serializer(), GetLogsResponse.of(result)))
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
        // All requested - don't filter by endpoint
        val query = if (isAllEndpoint(endpoint)) box.query() else box.query(LogEventEntity_.name.equal(endpoint))
        return query.build().use { it.find() }.analyze()
    }
}

private const val SpecialAllEndpoint = "all"

public fun isAllEndpoint(endpoint: String): Boolean {
    return endpoint.lowercase() == SpecialAllEndpoint
}

private fun Routing.endpoint(name: String, config: suspend PipelineContext<Unit, ApplicationCall>.() -> Unit) =
    get("__log_viewer__/$name") {
        addCorsHeader()
        config()
    }


@Serializable
internal data class GetLogsRequest(
    val endpoint: String,
    val query: String,
    val page: Int
)

@Serializable
internal sealed interface GetLogsResponse {
    companion object {
        fun of(result: SearchitResult<LogEvent>) = when (result) {
            is SearchitResult.Success -> Success(result.pageCount, result.items)
            is SearchitResult.SyntaxError -> SyntaxError(result.error)
        }
    }

    @Serializable
    data class Success(val pageCount: Int, val logs: List<LogEvent>) : GetLogsResponse

    @Serializable
    data class SyntaxError(val error: String) : GetLogsResponse
}

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


private val json = Json { encodeDefaults = true }


