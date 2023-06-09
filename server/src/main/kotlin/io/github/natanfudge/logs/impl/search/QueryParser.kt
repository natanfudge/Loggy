package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import org.jetbrains.annotations.TestOnly
import java.time.Instant

public typealias LogParseResult = Result<LogQuery, String>

public object QueryParser {

    public fun parseLogQuery(query: String): LogParseResult {
        val tokenized = tokenize(query)
        validateQuery(tokenized)?.let { return Err(it) }
        //TODO
        return Ok(LogQuery(Instant.now(), Instant.now(), listOf()))
    }

    // Returns null if it is valid
    private fun validateQuery(query: List<QueryToken>): String? {
        validateOperators(query)?.let { return it }
        validateTime(query, "to")?.let { return it }
        validateTime(query, "from")?.let { return it }
        return null
    }

    private fun validateOperators(query: List<QueryToken>): String? {
        return null
        //TODO
    }

    //TODO: validate date itself later
    private fun validateTime(query: List<QueryToken>, timeToken: String): String? {
        fun isTimeToken(token: QueryToken) = token is QueryToken.KeyValue && token.key == timeToken

        val index = query.indexOfFirst { isTimeToken(it) }
        // If nothing was specified we have nothing to worry about
        if (index == -1) return null
        val lastIndex = query.indexOfLast { isTimeToken(it) }
        if (index != lastIndex) return "'${timeToken}' was specified twice. It may only be specified once."
        // Check logical operator before
        if (index > 0 && query[index - 1] is QueryToken.Operator) {
            return "'${timeToken}' cannot be used with the logical operator '${query[index - 1]}'."
        }
        // Check logical operator after
        if (index < query.size - 1 && query[index + 1] is QueryToken.Operator) {
            return "'${timeToken}' cannot be used with the logical operator '${query[index + 1]}'."
        }

        // Check in parentheses
        var openParenthesesCount = 0
        for (token in query) {
            if (token is QueryToken.Parentheses) {
                when (token) {
                    QueryToken.Parentheses.Opening -> openParenthesesCount++
                    QueryToken.Parentheses.Closing -> openParenthesesCount--
                }
            } else if (isTimeToken(token)) {
                if (openParenthesesCount > 0) {
                    return "'${timeToken}' cannot be used inside of parentheses."
                }
            }
        }
        return null
    }


    @TestOnly
    public fun tokenize(query: String): List<QueryToken> {
        val tokens = query.split(' ')
            .flatMap {
                when {
                    // If it's just the parentheses keep it as is
                    it.length == 1 -> listOf(it)
                    // Add opening/closing parentheses as separate items when they are stuck to the front/end of query parts.
                    it.startsWith('(') -> listOf("(", it.removePrefix("("))
                    it.endsWith(')') -> listOf(it.removeSuffix(")"), ")")
                    else -> listOf(it)
                }
            }.map {
                when (it.lowercase()) {
                    "(" -> QueryToken.Parentheses.Opening
                    ")" -> QueryToken.Parentheses.Closing
                    "and" -> QueryToken.Operator.And
                    "or" -> QueryToken.Operator.Or
                    else -> {
                        if (it.contains(':')) QueryToken.KeyValue(it.substringBefore(':'), it.substringAfter(':'))
                        else QueryToken.Raw(it)
                    }
                }
            }

        return tokens
    }

    public sealed interface QueryToken {
        public enum class Operator : QueryToken {
            Or, And
        }

        public enum class Parentheses : QueryToken {
            Opening, Closing
        }

        public data class KeyValue(val key: String, val value: String) : QueryToken
        public data class Raw(val text: String) : QueryToken
    }
}

