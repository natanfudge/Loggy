package io.github.natanfudge.logs.impl

import java.time.Instant
import java.time.ZonedDateTime

internal fun Instant.toGmtDateTime() = ZonedDateTime.ofInstant(this, GMTZoneId)

internal fun nowGmt() = Instant.now().toGmtDateTime()

internal fun ZonedDateTime.startOfDay(): ZonedDateTime =
    ZonedDateTime.of(year, monthValue, dayOfMonth, 0, 0, 0, 0, GMTZoneId)

internal fun ZonedDateTime.endOfDay(): ZonedDateTime = ZonedDateTime.of(year, monthValue, dayOfMonth, 23, 59, 59, 999_999_999, GMTZoneId)

//    internal fun Instant.startOfDayGmt() : Instant  =  with(toGmtDateTime()) {
//        ZonedDateTime.of(year, monthValue, dayOfMonth, 0,0 ,0,0, GMTZoneId)
//    }.toInstant()
//    internal fun Instant.endOfDayGmt() : Instant  = with(toGmtDateTime()) {
//        ZonedDateTime.of(year, monthValue, dayOfMonth, 23,59 ,59,999_999_999, GMTZoneId)
//    }.toInstant()

internal fun yesterdayGmt(): ZonedDateTime = Instant.now().toGmtDateTime().minusDays(1)
internal fun lastWeekGmt(): ZonedDateTime = Instant.now().toGmtDateTime().minusWeeks(1)
internal fun lastMonthGmt(): ZonedDateTime = Instant.now().toGmtDateTime().minusMonths(1)
//internal fun yesterdayGmt(): Instant = Instant.now().toGmtDateTime().minusDays(1).toInstant()
//internal fun lastWeekGmt(): Instant = Instant.now().toGmtDateTime().minusWeeks(1).toInstant()
//internal fun lastMonthGmt(): Instant = Instant.now().toGmtDateTime().minusMonths(1).toInstant()