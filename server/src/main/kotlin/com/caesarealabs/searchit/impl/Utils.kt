package com.caesarealabs.searchit.impl

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.natanfudge.logs.impl.GMTZoneId
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime


internal inline fun <V, E> Result<V, E>.or(error: (Err<E>) -> V): V = when (this) {
    is Err -> error(this)
    is Ok -> value
}

/**
 * Returns null if more than 3 parts or this is empty string
 */
internal fun String.splitUpTo3(vararg delimiters: String): Triple<String, String?, String?>? {
    val split = split(*delimiters)
    return when (split.size) {
        1 -> Triple(split[0], null, null)
        2 -> Triple(split[0], split[1], null)
        3 -> Triple(split[0], split[1], split[2])
        else -> null
    }
}


/**
 * Splits a list into 2 according to [predicate]. Returning true will put it in the first list, otherwise the second list.
 */
internal fun <T> List<T>.splitBy(predicate: (T) -> Boolean): Pair<List<T>, List<T>> {
    val matches = mutableListOf<T>()
    val doesntMatch = mutableListOf<T>()
    for (item in this) {
        if (predicate(item)) {
            matches.add(item)
        } else {
            doesntMatch.add(item)
        }
    }
    return matches to doesntMatch
}


internal val GMTZoneId = ZoneId.of("GMT")

internal fun ZonedDateTime.startOfDay(): ZonedDateTime =
    ZonedDateTime.of(year, monthValue, dayOfMonth, 0, 0, 0, 0, GMTZoneId)

internal fun ZonedDateTime.endOfDay(): ZonedDateTime = ZonedDateTime.of(year, monthValue, dayOfMonth, 23, 59, 59, 999_999_999, GMTZoneId)
internal fun nowGmt() = Instant.now().toGmtDateTime()

internal fun Instant.toGmtDateTime() = ZonedDateTime.ofInstant(this, GMTZoneId)
internal fun yesterdayGmt(): ZonedDateTime = Instant.now().toGmtDateTime().minusDays(1)
internal fun lastWeekGmt(): ZonedDateTime = Instant.now().toGmtDateTime().minusWeeks(1)
internal fun lastMonthGmt(): ZonedDateTime = Instant.now().toGmtDateTime().minusMonths(1)