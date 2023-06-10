package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.getOrElse
import io.github.natanfudge.logs.impl.*
import io.github.natanfudge.logs.impl.endOfDayGmt
import io.github.natanfudge.logs.impl.lastWeekGmt
import io.github.natanfudge.logs.impl.splitBy
import io.github.natanfudge.logs.impl.startOfDayGmt
import io.github.natanfudge.logs.impl.yesterdayGmt
import java.time.Instant
import java.time.LocalDate
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

        val (timeRange, otherTokens) = tokenized.takeTimerangeFilter().getOrElse { return Err(it) }

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
            parseTime(startDateToken).getOrElse { return Err(it) }.startOfDayGmt()
        }
        val endDate = if (endDateToken == null) {
            defaultEndTime()
        } else {
            // We always match up to the end of the specified day
            parseTime(endDateToken).getOrElse { return Err(it) }.endOfDayGmt()
        }

        return Ok(TimeRange(startDate, endDate) to timeIrrelevant)
    }


    private fun defaultStartTime() = Instant.now().startOfDayGmt()
    private fun defaultEndTime() = Instant.now().endOfDayGmt()


    private fun parseTime(token: QueryToken.KeyValue): Result<Instant, String> {
        when(val time = token.value) {
            "today" -> return Ok(Instant.now())
            "yesterday" -> return Ok(yesterdayGmt())
            "lastweek" -> return Ok(lastWeekGmt())
            "lastmonth" -> return Ok(lastMonthGmt())
            else -> {
                val (dayString,monthString,yearString) = time.splitUpTo3("/", "-", "\\") ?: return Err("Invalid date string '${time}'")
                val day = dayString.toIntOrNull() ?: return Err("Invalid day '${dayString}' in date '${time}'")
                val month = monthString?.parseInt(tokenName = "month", time)?.getOrElse { return Err(it) } ?: defaultMonth()
                val year = yearString?.parseInt(tokenName = "year", time)?.getOrElse { return Err(it) } ?: defaultYear()


                val actualMonth = monthString ?: Instant.now().toGmtDateTime().monthValue.toString()
                val actualYear = yearString ?: Instant.now().toGmtDateTime().year.toString()

                ZonedDateTime.of()
            }
        }
    }

    private fun String.parseInt(tokenName: String, time: String): Result<Int,String> {
        val value = toIntOrNull() ?: return Err("Invalid month '${tokenName}' in date '${time}'")
        return Ok(value)
    }

    // Default month - this month
    private fun defaultMonth() = Instant.now().toGmtDateTime().monthValue
    // Default year - this year
    private fun defaultYear() = Instant.now().toGmtDateTime().year

}

