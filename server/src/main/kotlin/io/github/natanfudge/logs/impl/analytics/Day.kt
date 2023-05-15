package io.github.natanfudge.logs.impl.analytics

import io.github.natanfudge.logs.impl.GMTZoneId
import kotlinx.serialization.Serializable
import java.time.Instant
import java.time.ZonedDateTime

@Serializable
public data class Day(val day: UByte, val month: UByte, val year: UShort)

internal fun Day.startOfDayGmt(): Instant = ZonedDateTime.of(
    year.toInt(), month.toInt(),day.toInt(), 0, 0, 0, 0, GMTZoneId
).toInstant()
internal fun Day.endOfDayGmt(): Instant = ZonedDateTime.of(
    year.toInt(), month.toInt(), day.toInt(), 23, 59, 59, 999_999_999, GMTZoneId
).toInstant()
