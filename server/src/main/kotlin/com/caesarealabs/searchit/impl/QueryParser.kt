package com.caesarealabs.searchit.impl

import com.caesarealabs.searchit.Filter
import com.caesarealabs.searchit.TimeRange
import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import java.time.DateTimeException
import java.time.Instant
import java.time.ZonedDateTime

internal typealias QueryParseResult = Result<SearchitQuery, String>

internal class QueryParser(private val specialFilters: SpecialFilters) {
    companion object {
        const val StartDateToken: String = "from"
        const val EndDateToken: String = "to"
    }

    private val allDateTokens = listOf(StartDateToken, EndDateToken)

    fun parseQuery(query: String): QueryParseResult {
        try {
            val tokenized = QueryTokenizer.tokenize(query).or { return it }
            // If validateQuery returned non-null it means we have an error
            QueryValidator.validateQuery(tokenized)?.let { return Err(it) }

            val (timeRange, otherTokens) = tokenized.takeTimeRangeFilter().or { return it }

            return Ok(SearchitQuery(timeRange, parseOtherFilters(otherTokens).or { return it }))
        } catch (e: Exception) {
            throw io.ktor.http.parsing.ParseException("Failed to parse query: $query", e)
        }

    }

    private fun parseOtherFilters(tokens: List<QueryToken>): Result<List<SearchitFilter>, String> {
        val folded = foldFilters(tokens)
        return Ok(folded.map { token -> token.parse().or { return it } })
    }

    private fun FoldedToken.parse(): Result<SearchitFilter, String> = when (this) {
        is FoldedToken.Binary -> {
            val constructor = if (operator == QueryToken.Operator.And) SearchitFilter::And else SearchitFilter::Or
            Ok(constructor(left.parse().or { return it }, right.parse().or { return it }))
        }

        FoldedToken.None -> Ok(SearchitFilter.None)
        is FoldedToken.Not -> Ok(SearchitFilter.Not(folded.parse().or { return it }))
        is FoldedToken.Single -> when (value) {
            is QueryToken.KeyValue -> {
                // See if any special filters match this key
                val matchingSpecialFilter = specialFilters.find { it.keyword == value.key }
                val value = if (matchingSpecialFilter != null) {
                    // We trust that the filter is for the correct type here
                    @Suppress("UNCHECKED_CAST")
                    val filter = matchingSpecialFilter.filterFactory(value.value)?.let { SearchitFilter.Special(it as Filter<Any?>) }
                    if (filter != null) Ok(filter) else Err("Value '${value.value}' is not valid for the ${value.key} filter.")
                } else {
                    // Not a special filter - it's just a normal key/value filter
                    Ok(SearchitFilter.KeyValue(value.key, value.value))
                }
                value
            }

            is QueryToken.Raw -> Ok(SearchitFilter.Text(value.text))
        }
    }

    sealed interface FoldedToken {
        object None : FoldedToken
        data class Single(val value: QueryToken.WithContent) : FoldedToken {
            override fun toString(): String {
                return value.toString()
            }
        }

        data class Binary(val operator: QueryToken.Operator, val left: FoldedToken, val right: FoldedToken) : FoldedToken {
            override fun toString(): String {
                return when (operator) {
                    QueryToken.Operator.Or -> "(${left}) or (${right})"
                    QueryToken.Operator.And -> "(${left}) and (${right})"
                    else -> error("Impossible - only and and or are allowed here")
                }
            }
        }

        data class Not(val folded: FoldedToken) : FoldedToken {
            override fun toString(): String {
                return "not (${folded})"
            }
        }
    }


     fun foldFilters(tokens: List<QueryToken>): List<FoldedToken> {
        val folded = foldFiltersImpl(tokens).first

        val semiCollapsed = mutableListOf<FoldedToken>()
        collapseTopLevelAnds(folded, semiCollapsed)
        return semiCollapsed
    }

    // Takes all of the ANDs at the start and converts them into a list for easier debugging
    private fun collapseTopLevelAnds(folded: FoldedToken, toList: MutableList<FoldedToken>) {
        when (folded) {
            is FoldedToken.Binary -> {
                if (folded.operator == QueryToken.Operator.And) {
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
        if (tokens.size == 1) return FoldedToken.Single(tokens[0] as QueryToken.WithContent) to 1

        val (firstOperand, firstOperandTokenCount) = when (val firstToken = tokens[0]) {
            QueryToken.Operator.Not -> {
                // Not: fold the not together with whatever it is applied to
                val (operand, operandLength) = foldFiltersImpl(tokens.subList(1, tokens.size))
                FoldedToken.Not(operand) to operandLength + 1
            }

            is QueryToken.Operator -> error("Unexpected operator with missing operand in token list $tokens")
            is QueryToken.Parentheses -> {
                var opened = 1
                var i = 1
                while (i < tokens.size) {
                    if (tokens[i] == QueryToken.Parentheses.Closing) opened--
                    else if (tokens[i] == QueryToken.Parentheses.Opening) opened++
                    if (opened == 0) break
                    i++
                }

                // From the point after the opening paren (1) up until but not including the close paren (i)
                val (folded, tokenCount) = foldFiltersImpl(tokens.subList(1, i))
                // Include the two parentheses as well
                folded to tokenCount + 2
            }
            // Normal operand
            is QueryToken.WithContent -> {
                val nextToken = tokens[1]
                if (nextToken is QueryToken.Operator && nextToken != QueryToken.Operator.Not) {
                    // And/Or: fold the current operand together with whatever comes after the operator.
                    val (operand, operandLength) = foldFiltersImpl(tokens.subList(2, tokens.size))
                    FoldedToken.Binary(nextToken, FoldedToken.Single(firstToken), operand) to operandLength + 2
                } else {
                    // No operand after - just a single token to be AND'd
                    FoldedToken.Single(firstToken) to 1
                }
            }
        }

        if (firstOperandTokenCount == tokens.size) {
            // No tokens left - return the resulting operand
            return firstOperand to firstOperandTokenCount
        } else {
            val tokenAfter = tokens[firstOperandTokenCount]
            // If there's an and / or , we need to skip it.
            val secondOperatorStart =
                if (tokenAfter is QueryToken.Operator && tokenAfter != QueryToken.Operator.Not) firstOperandTokenCount + 1 else firstOperandTokenCount
            // Tokens left - AND the leftover tokens with the first operand
            val (secondOperand, secondOperandTokenCount) = foldFiltersImpl(tokens.subList(secondOperatorStart, tokens.size))
            // No need to add '+1' because the AND is not a real token here
            val totalTokenCount = secondOperatorStart + secondOperandTokenCount
            // Apply the correct operator that comes after
            val operator = if (tokenAfter == QueryToken.Operator.Or) QueryToken.Operator.Or else QueryToken.Operator.And
            return FoldedToken.Binary(operator, firstOperand, secondOperand) to totalTokenCount
        }

    }

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
        return when (val time = token.value.lowercase()) {
            "today" -> Ok(nowGmt())
            "yesterday" -> Ok(yesterdayGmt())
            "lastweek" -> Ok(lastWeekGmt())
            "lastmonth" -> Ok(lastMonthGmt())
            else -> {
                val (dayString, monthString, yearString) = time.splitUpTo3("/", "-", "\\") ?: return Err("Invalid date string '${time}'")
                val day = dayString.parseInt(tokenName = "day", time).or { return it }
                val month = monthString?.parseInt(tokenName = "month", time)?.or { return it } ?: defaultMonth()
                val year = yearString?.parseInt(tokenName = "year", time)?.or { return it } ?: defaultYear()
                // Allow typing years of the sort '23' to mean 2023
                val actualYear = if (year < 1000) year + 2000 else year

                try {
                    Ok(ZonedDateTime.of(actualYear, month, day, 0, 0, 0, 0, GMTZoneId))
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