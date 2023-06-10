package io.github.natanfudge.logs.impl.search

import org.jetbrains.annotations.TestOnly
// public for tests
public object QueryTokenizer {
    // After this call everything turns into lowercase
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
                when (val lowercase = it.lowercase()) {
                    "(" -> QueryToken.Parentheses.Opening
                    ")" -> QueryToken.Parentheses.Closing
                    "and" -> QueryToken.Operator.And
                    "or" -> QueryToken.Operator.Or
                    else -> {
                        if (lowercase.contains(':')) QueryToken.KeyValue(lowercase.substringBefore(':'), lowercase.substringAfter(':'))
                        else QueryToken.Raw(lowercase)
                    }
                }
            }

        return tokens
    }

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