package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.natanfudge.logs.impl.*
import java.time.DateTimeException
import java.time.Instant
import java.time.ZonedDateTime

// public for testing
public typealias LogParseResult = Result<LogQuery, String>

// public for testing
public object QueryParser {

    public const val StartDateToken: String = "from"
    public const val EndDateToken: String = "to"
    private val allDateTokens = listOf(StartDateToken, EndDateToken)

    public fun parseLogQuery(query: String): LogParseResult {
        val tokenized = QueryTokenizer.tokenize(query)
        QueryValidator.validateQuery(tokenized)?.let { return Err(it) }

        val (timeRange, otherTokens) = tokenized.takeTimerangeFilter().or { return it }

        return Ok(LogQuery(timeRange, listOf()))
    }

    private fun List<QueryToken>.takeTimerangeFilter(): Result<Pair<TimeRange, List<QueryToken>>, String> {
        val (timeRelevant, timeIrrelevant) = splitBy { it is QueryToken.KeyValue && it.key in allDateTokens }
        // These are lists of size at most 1. May be empty if nothing was specified
        val (startDateList, endDateList) = timeRelevant.map { it as QueryToken.KeyValue }.splitBy { it.key == StartDateToken }
        val startDateToken = startDateList.getOrNull(0)
        val endDateToken = endDateList.getOrNull(0)

        val startDate = if (startDateToken == null) {
            defaultStartTime()
        } else {
            // We always match starting from the start of the specified day
            parseTime(startDateToken).or { return it }.startOfDay()
        }
        val endDate = if (endDateToken == null) {
            defaultEndTime()
        } else {
            // We always match up to the end of the specified day
            parseTime(endDateToken).or { return it }.endOfDay()
        }

        if (startDate.isAfter(endDate)) {
            return Err("Specified start date ${startDateToken?.value} can't come after specified end date ${endDateToken?.value}")
        }

        return Ok(TimeRange(startDate.toInstant(), endDate.toInstant()) to timeIrrelevant)
    }


    private fun defaultStartTime() = nowGmt().startOfDay()
    private fun defaultEndTime() = nowGmt().endOfDay()


    private fun parseTime(token: QueryToken.KeyValue): Result<ZonedDateTime, String> {
        return when (val time = token.value) {
            "today" -> Ok(nowGmt())
            "yesterday" -> Ok(yesterdayGmt())
            "lastweek" -> Ok(lastWeekGmt())
            "lastmonth" -> Ok(lastMonthGmt())
            else -> {
                val (dayString, monthString, yearString) = time.splitUpTo3("/", "-", "\\") ?: return Err("Invalid date string '${time}'")
                val day = dayString.parseInt(tokenName = "day", time).or { return it }
                val month = monthString?.parseInt(tokenName = "month", time)?.or { return it } ?: defaultMonth()
                val year = yearString?.parseInt(tokenName = "year", time)?.or { return it } ?: defaultYear()

                try {
                    Ok(ZonedDateTime.of(year, month, day, 0, 0, 0, 0, GMTZoneId))
                } catch (e: DateTimeException) {
                    Err("Invalid date ${day}/${month}/${year}")
                }
            }
        }
    }

    private fun String.parseInt(tokenName: String, time: String): Result<Int, String> {
        val value = toIntOrNull() ?: return Err("Invalid $tokenName '${this}' in date '${time}'")
        return Ok(value)
    }

    // Default month - this month
    private fun defaultMonth() = Instant.now().toGmtDateTime().monthValue

    // Default year - this year
    private fun defaultYear() = Instant.now().toGmtDateTime().year

}

