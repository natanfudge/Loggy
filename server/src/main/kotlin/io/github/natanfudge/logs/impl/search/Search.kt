package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.getOrElse
import com.github.michaelbull.result.mapError
import io.github.natanfudge.logs.impl.*
import io.objectbox.Box
import io.objectbox.query.QueryCondition
import java.time.Instant
import kotlin.math.ceil

/**
 * A note about definitions.
 * A _search_ is the action a user makes to get some results.
 * A _filter_ is a simple condition that may be true or false for a certain element.
 * A _query_ is composed of multiple filters that may be AND'd or OR'd.
 */



private const val PageSize = 18
internal fun Box<LogEventEntity>.getLogs(request: GetLogsRequest): LogResponse {
    val parsedQuery = QueryParser.parseLogQuery(request.query).getOrElse { return LogResponse.SyntaxError(it) }
    val fullSearchResults = search(parsedQuery, request.endpoint)
    val allPageCount = ceil(fullSearchResults.size.toDouble() / PageSize).toInt()
    // Return only PageSize items, and skip pages before the requested page
    val pageSearchResults = fullSearchResults.drop(request.page * PageSize).take(PageSize)

    return LogResponse.Success(pageCount = allPageCount, logs = pageSearchResults)
}



private fun Box<LogEventEntity>.search(query: LogQuery, endpoint: String): List<LogEvent> {
    val inMemoryResults = query(getObjectboxQuery(query, endpoint)).build().use { it.find() }
    return inMemoryResults.searchInMemory(query.filters)
}

private fun List<LogEventEntity>.searchInMemory(filters: List<LogFilter>): List<LogEvent> {
    var predicate = { entity: LogEvent -> true }
    for (filter in filters) {
        val filterPredicate = filter.toPredicate()
        predicate = { predicate(it) && filterPredicate(it) }
    }
    val parsed = map { it.toLogEvent() }
    return parsed.filter(predicate)
}


/**
 * Will only query the date
 */
private fun getObjectboxQuery(logQuery: LogQuery, endpoint: String): QueryCondition<LogEventEntity> {
    return LogEventEntity_.name.equal(endpoint)
        .and(LogEventEntity_.startTime.between(logQuery.startTime.toEpochMilli(), logQuery.endTime.toEpochMilli()))
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

    is LogFilter.KeyValue -> TODO()
    is LogFilter.Severity -> TODO()
    is LogFilter.Text -> TODO()
}


//TODO: Rework and properly define this terminology:
// - Query / Filter / Search
// - Severity / Level
//   Then search for all usages and make them all conform


public sealed interface LogFilter {
    public data class Not(val filter: LogFilter) : LogFilter
    public data class Or(val first: LogFilter, val second: LogFilter) : LogFilter
    public data class And(val first: LogFilter, val second: LogFilter) : LogFilter
    public data class KeyValue(val key: String, val value: String) : LogFilter
    public data class Text(val text: String) : LogFilter
    public data class Severity(val severity: LogLine.Severity) : LogFilter
//    data class Time(val start: Instant, val end: Instant): Filter
}

/**
 * How a search works:
 * - First, we use objectbox directly to filter by start and end date. (This is why start/end time is seperate here)
 * - Then, we filter in-memory for the rest of the filters. Since start/end date should filter most things, this is not too bad.
 * This could be optimized in the future to use indices for everything. It would require storing the logs differently though.
 */

public data class LogQuery(val startTime: Instant, val endTime: Instant, val filters: List<LogFilter>)


