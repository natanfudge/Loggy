package io.github.natanfudge.logs.impl.search

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


// TODO: document filter API

private const val PageSize = 18
internal fun Box<LogEventEntity>.getLogs(request: GetLogsRequest): LogResponse {
    val fullSearchResults = search(parseLogQuery(request.filter), request.endpoint)
    val allPageCount = ceil(fullSearchResults.size.toDouble() / PageSize).toInt()
    // Return only PageSize items, and skip pages before the requested page
    val pageSearchResults = fullSearchResults.drop(request.page * PageSize).take(PageSize)

    return LogResponse(pageCount = allPageCount, logs = pageSearchResults)
}

private fun parseLogQuery(query: String): LogQuery {
    val tokens = query.split(" ")
    val (severityFilters, nonSeverityFilters) = tokens.parseSeverityFilters()
    TODO()
}

private fun Box<LogEventEntity>.search(query: LogQuery, endpoint: String): List<LogEvent> {
    val inMemoryResults = query(getObjectboxQuery(query, endpoint)).build().use { it.find() }
    return inMemoryResults.searchInMemory(query.filters)
}

private fun List<LogEventEntity>.searchInMemory(filters: List<Filter>): List<LogEvent> {
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

private fun Filter.toPredicate(): (LogEvent) -> Boolean = when (this) {
    is Filter.And -> {
        val firstCondition = first.toPredicate()
        val secondCondition = second.toPredicate()
        ({ firstCondition(it) && secondCondition(it) })
    }

    is Filter.Or -> {
        val firstCondition = first.toPredicate()
        val secondCondition = second.toPredicate()
        ({ firstCondition(it) || secondCondition(it) })
    }

    is Filter.Not -> {
        val condition = filter.toPredicate()
        ({ !condition(it) })
    }

    is Filter.KeyValue -> TODO()
    is Filter.Severity -> TODO()
    is Filter.Text -> TODO()
}


//TODO: Rework and properly define this terminology:
// - Query / Filter / Search
// - Severity / Level
//   Then search for all usages and make them all conform


internal sealed interface Filter {
    data class Not(val filter: Filter) : Filter
    data class Or(val first: Filter, val second: Filter) : Filter
    data class And(val first: Filter, val second: Filter) : Filter
    data class KeyValue(val key: String, val value: String) : Filter
    data class Text(val text: String) : Filter
    data class Severity(val severity: LogLine.Severity) : Filter
//    data class Time(val start: Instant, val end: Instant): Filter
}

/**
 * How a search works:
 * - First, we use objectbox directly to filter by start and end date. (This is why start/end time is seperate here)
 * - Then, we filter in-memory for the rest of the filters. Since start/end date should filter most things, this is not too bad.
 * This could be optimized in the future to use indices for everything. It would require storing the logs differently though.
 */

internal data class LogQuery(val startTime: Instant, val endTime: Instant, val filters: List<Filter>)


