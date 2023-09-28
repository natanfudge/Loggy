package com.caesarealabs.searchit.impl

import com.caesarealabs.searchit.*

internal fun <T> SearchitContext<T>.search(query: SearchitQuery): List<T> {
    val inMemoryResults = database.query(query.timeRange)
    return with(lens) { inMemoryResults.searchInMemory(query.filters) }
}

context(DataLens<T, *>)
internal fun <T> List<T>.searchInMemory(filters: List<SearchitFilter>): List<T> {
    return filter {
        for (filter in filters) {
            if (!filter.toPredicate<T>()(it)) return@filter false
        }
        true
    }
}


/**
 * At the end of the day, every log filter represents a (T) -> Boolean - either accept this item or don't.
 * Each filter just has different conditions.
 */
context(DataLens<T, *>)
private fun <T> SearchitFilter.toPredicate(): (T) -> Boolean = when (this) {
    is SearchitFilter.And -> {
        val firstCondition = first.toPredicate()
        val secondCondition = second.toPredicate()
        ({ firstCondition(it) && secondCondition(it) })
    }

    is SearchitFilter.Or -> {
        val firstCondition = first.toPredicate()
        val secondCondition = second.toPredicate()
        ({ firstCondition(it) || secondCondition(it) })
    }

    is SearchitFilter.Not -> {
        val condition = filter.toPredicate()
        ({ !condition(it) })
    }
    is SearchitFilter.KeyValue -> ({ hasKeyValue(it, key, value) })
    is SearchitFilter.Special -> ({ filter(it) })


    is SearchitFilter.Text -> ({ containsText(it, text) })
    SearchitFilter.None -> ({ true })
}


// public for tests
internal sealed interface SearchitFilter {
    data class Not(val filter: SearchitFilter) : SearchitFilter
    data class Or(val first: SearchitFilter, val second: SearchitFilter) : SearchitFilter
    data class And(val first: SearchitFilter, val second: SearchitFilter) : SearchitFilter
    data class KeyValue(val key: String, val value: String) : SearchitFilter
    data class Text(val text: String) : SearchitFilter


    data class Special(val filter: Filter<Any?>) : SearchitFilter

    object None : SearchitFilter
}


/**
 * How a search works:
 * - First, we use objectbox directly to filter by start and end date. (This is why start/end time is seperate here)
 * - Then, we filter in-memory for the rest of the filters. Since start/end date should filter most things, this is not too bad.
 * This could be optimized in the future to use indices for everything. It would require storing the logs differently though.
 *
 * In [filters] we use a list of AND'd filters instead of one big recursive LogFilter.And for easier debugging.
 */
internal data class SearchitQuery(val timeRange: TimeRange, val filters: List<SearchitFilter>)

