package io.github.natanfudge.logs.impl.search

import org.jetbrains.annotations.TestOnly

// public for tests
public object QueryTokenizer {
    // After this call everything turns into lowercase
    @TestOnly
    public fun tokenize(query: String): List<QueryToken> {
        val trimmed = query.trim()
        if (trimmed == "") return listOf()
        val split = trimmed.split(Regex("\\s+"))
        val tokens = split.flatMap {
            when {
                // If it's just the parentheses keep it as is
                it.length == 1 -> listOf(it)


                // Add opening/closing parentheses as separate items when they are stuck to the front/end of query parts.
                it.startsWith('(') -> {
                    // Include all leading parentheses separately
                    var parenCount = 0
                    for (char in it) {
                        if (char == '(') parenCount++
                        else break
                    }
                    List(parenCount) { "(" } + it.substring(parenCount)
                }

                it.endsWith(')') -> {
                    // Include all trailing parentheses separately
                    var parenCount = 0
                    for (char in it.reversed()) {
                        if (char == ')') parenCount++
                        else break
                    }
                    listOf(it.substring(0, it.length - parenCount)) + List(parenCount) { ")" }
                }

                else -> listOf(it)
            }
        }.map {
            when (val lowercase = it.lowercase()) {
                "(" -> QueryToken.Parentheses.Opening
                ")" -> QueryToken.Parentheses.Closing
                "and" -> QueryToken.Operator.And
                "or" -> QueryToken.Operator.Or
                "not" -> QueryToken.Operator.Not
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
        Or, And, Not
    }

    public enum class Parentheses : QueryToken {
        Opening, Closing
    }

    public data class KeyValue(val key: String, val value: String) : QueryToken {
        override fun toString(): String = "$key:$value"
    }

    public data class Raw(val text: String) : QueryToken {
        override fun toString(): String = text
    }
}