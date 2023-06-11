package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.natanfudge.logs.impl.*
import io.github.natanfudge.logs.impl.search.QueryToken.Operator
import io.github.natanfudge.logs.impl.search.QueryToken.Parentheses
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
        try {
            val tokenized = QueryTokenizer.tokenize(query)
            QueryValidator.validateQuery(tokenized)?.let { return Err(it) }

            val (timeRange, otherTokens) = tokenized.takeTimeRangeFilter().or { return it }

            return Ok(LogQuery(timeRange, listOf()))
        } catch (e: Exception) {
            throw io.ktor.http.parsing.ParseException("Failed to parse query: $query", e)
        }

    }

//    private fun parseOtherFilters(tokens: List<QueryToken>): List<LogFilter> {
//        val filters = mutableListOf<LogFilter>()
//
//        // True if there's currently an 'and'
//        var unclosedExpression = false
//        for (token in tokens) {
//
//        }
//    }

    //TODO: make internal
    public sealed interface FoldedToken {
        public object None : FoldedToken
        public data class Single(val value: QueryToken) : FoldedToken {
            override fun toString(): String {
                return value.toString()
            }
        }

        public data class Binary(val operator: Operator, val left: FoldedToken, val right: FoldedToken) : FoldedToken {
            override fun toString(): String {
                return when (operator) {
                    Operator.Or -> "(${left}) or (${right})"
                    Operator.And -> "(${left}) and (${right})"
                    else -> error("Impossible - only and and or are allowed here")
                }
            }
        }

        public data class Not(val folded: FoldedToken) : FoldedToken {
            override fun toString(): String {
                return "not (${folded})"
            }
        }
    }


    public fun foldFilters(tokens: List<QueryToken>): List<FoldedToken> {
        val folded = foldFiltersImpl(tokens).first

        val semiCollapsed = mutableListOf<FoldedToken>()
        collapseTopLevelAnds(folded, semiCollapsed)
        return semiCollapsed
    }

    // Takes all of the ANDs at the start and converts them into a list for easier debugging
    private fun collapseTopLevelAnds(folded: FoldedToken, toList: MutableList<FoldedToken>) {
        when (folded) {
            is FoldedToken.Binary -> {
                if (folded.operator == Operator.And) {
                    // Break open ANDs
                    collapseTopLevelAnds(folded.left, toList)
                    collapseTopLevelAnds(folded.right, toList)
                } else {
                    // Stop recursing when it's not an AND
                    toList.add(folded)
                }
            }

            FoldedToken.None -> {}
            is FoldedToken.Single -> toList.add(folded)
            is FoldedToken.Not -> toList.add(folded)
        }
    }

    // Returns the folded token and how many tokens is composes
    private fun foldFiltersImpl(tokens: List<QueryToken>): Pair<FoldedToken, Int> {
        if (tokens.isEmpty()) return FoldedToken.None to 0
        if (tokens.size == 1) return FoldedToken.Single(tokens[0]) to 1

        val (firstOperand, firstOperandTokenCount) = when (tokens[0]) {
            Operator.Not -> {
                // Not: fold the not together with whatever it is applied to
                val (operand, operandLength) = foldFiltersImpl(tokens.subList(1, tokens.size))
                FoldedToken.Not(operand) to operandLength + 1
            }

            is Operator -> error("Unexpected operator with missing operand in token list $tokens")
            is Parentheses -> {
                var opened = 1
                var i = 1
                while (i < tokens.size) {
                    if (tokens[i] == Parentheses.Closing) opened--
                    else if (tokens[i] == Parentheses.Opening) opened++
                    if (opened == 0) break
                    i++
                }

                // From the point after the opening paren (1) up until but not including the close paren (i)
                val (folded, tokenCount) = foldFiltersImpl(tokens.subList(1, i))
                // Include the two parentheses as well
                folded to tokenCount + 2
            }
            // Normal operand
            else -> {
                val nextToken = tokens[1]
                if (nextToken is Operator && nextToken != Operator.Not) {
                    // And/Or: fold the current operand together with whatever comes after the operator.
                    val (operand, operandLength) = foldFiltersImpl(tokens.subList(2, tokens.size))
                    FoldedToken.Binary(nextToken, FoldedToken.Single(tokens[0]), operand) to operandLength + 2
                } else {
                    // No operand after - just a single token to be AND'd
                    FoldedToken.Single(tokens[0]) to 1
                }
            }
        }

        if (firstOperandTokenCount == tokens.size) {
            // No tokens left - return the resulting operand
            return firstOperand to firstOperandTokenCount
        } else {
            val tokenAfter = tokens[firstOperandTokenCount]
            // If there's an and / or , we need to skip it.
            val secondOperatorStart = if (tokenAfter is Operator && tokenAfter != Operator.Not) firstOperandTokenCount + 1 else firstOperandTokenCount
            // Tokens left - AND the leftover tokens with the first operand
            val (secondOperand, secondOperandTokenCount) = foldFiltersImpl(tokens.subList(secondOperatorStart, tokens.size))
            // No need to add '+1' because the AND is not a real token here
            val totalTokenCount = secondOperatorStart + secondOperandTokenCount
            // Apply the correct operator that comes after
            val operator = if (tokenAfter == Operator.Or) Operator.Or else Operator.And
            return FoldedToken.Binary(operator, firstOperand, secondOperand) to totalTokenCount
        }

    }

//    private fun foldPart()


    //TODO: validate the NOT thing and test the validation

    private fun List<QueryToken>.takeTimeRangeFilter(): Result<Pair<TimeRange, List<QueryToken>>, String> {
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

