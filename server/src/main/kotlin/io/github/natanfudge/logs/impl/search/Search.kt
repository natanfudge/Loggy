package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.getOrElse
import io.github.natanfudge.logs.impl.*
import io.objectbox.Box
import io.objectbox.query.QueryCondition
import org.jetbrains.annotations.TestOnly
import java.time.Instant
import kotlin.math.ceil
import kotlin.math.min

/**
 * A note about definitions.
 * A _search_ is the action a user makes to get some results.
 * A _filter_ is a simple condition that may be true or false for a certain element.
 * A _query_ is composed of multiple filters that may be AND'd or OR'd.
 */


private const val PageSize = 18
internal fun Box<LogEventEntity>.getLogs(request: GetLogsRequest): LogResponse {
    val parsedQuery = QueryParser.parseLogQuery(request.query).getOrElse { return LogResponse.SyntaxError(it) }
    val fullSearchResults = search(parsedQuery, request.endpoint).sortedByDescending { it.startTime }
    val allPageCount = ceil(fullSearchResults.size.toDouble() / PageSize).toInt()
    val page = request.page.coerceAtMost((allPageCount - 1).coerceAtLeast(0))
    // Return only PageSize items, and skip pages before the requested page
    val pageSearchResults = fullSearchResults.drop(page * PageSize).take(PageSize)

    return LogResponse.Success(pageCount = allPageCount, logs = pageSearchResults)
}


private fun Box<LogEventEntity>.search(query: LogQuery, endpoint: String): List<LogEvent> {
    val inMemoryResults = query(getObjectboxQuery(query, endpoint)).build().use { it.find() }
    return inMemoryResults.map { it.toLogEvent() }.searchInMemory(query.filters)
}

@TestOnly
public fun List<LogEvent>.searchInMemory(filters: List<LogFilter>): List<LogEvent> {
    return filter {
        for (filter in filters) {
            if (!filter.toPredicate()(it)) return@filter false
        }
        true
    }
}


/**
 * Will only query the date
 */
private fun getObjectboxQuery(logQuery: LogQuery, endpoint: String): QueryCondition<LogEventEntity> {
    return LogEventEntity_.name.equal(endpoint)
        .and(LogEventEntity_.startTime.between(logQuery.timeRange.start.toEpochMilli(), logQuery.timeRange.end.toEpochMilli()))
}

private fun LogFilter.toPredicate(): (LogEvent) -> Boolean = when (this) {
    is LogFilter.And -> {
        val firstCondition = first.toPredicate()
        val secondCondition = second.toPredicate()
        ({ firstCondition(it) && secondCondition(it) })
    }

    is LogFilter.Or -> {
        val firstCondition = first.toPredicate()
        val secondCondition = second.toPredicate()
        ({ firstCondition(it) || secondCondition(it) })
    }

    is LogFilter.Not -> {
        val condition = filter.toPredicate()
        ({ !condition(it) })
    }

    is LogFilter.KeyValue -> ({ logEvent ->
        logEvent.logs.any { it is LogLine.Detail && it.key.equals(key, ignoreCase = true) && it.value.equals(value, ignoreCase = true)}
    })

    is LogFilter.Severity -> ({ logEvent ->
        val logEventSeverity = logEvent.getSeverity()
        if (exact) logEventSeverity == this.severity else logEventSeverity.level >= this.severity.level
    })

    is LogFilter.Text -> ({ logEvent ->
        logEvent.logs.any {
            when (it) {
                // Search for the text in the key/value for details
                is LogLine.Detail -> it.key.contains(text, ignoreCase = true) || it.value.contains(text, ignoreCase = true)
                // Search for the text in the message contents for messages
                is LogLine.Message -> it.message.contains(text, ignoreCase = true)
            }
        }
    })

    LogFilter.None -> ({ true })
}

// public for tests
public sealed interface LogFilter {
    public data class Not(val filter: LogFilter) : LogFilter
    public data class Or(val first: LogFilter, val second: LogFilter) : LogFilter
    public data class And(val first: LogFilter, val second: LogFilter) : LogFilter
    public data class KeyValue(val key: String, val value: String) : LogFilter
    public data class Text(val text: String) : LogFilter

    /**
    If not [exact] then at least
     */
    public data class Severity(val severity: LogLine.Severity, val exact: Boolean) : LogFilter

    public object None : LogFilter
}

/**
 * How a search works:
 * - First, we use objectbox directly to filter by start and end date. (This is why start/end time is seperate here)
 * - Then, we filter in-memory for the rest of the filters. Since start/end date should filter most things, this is not too bad.
 * This could be optimized in the future to use indices for everything. It would require storing the logs differently though.
 *
 * In [filters] we use a list of AND'd filters instead of one big recursive LogFilter.And for easier debugging.
 */
// public for tests
public data class LogQuery(val timeRange: TimeRange, val filters: List<LogFilter>)

// public for tests
public data class TimeRange(val start: Instant, val end: Instant)
