package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import org.jetbrains.annotations.TestOnly

private const val Quote = '\"'
private const val Backslash = '\\'

// public for tests
public object QueryTokenizer {
    // After this call everything turns into lowercase
    @TestOnly
    public fun tokenize(query: String): Result<List<QueryToken>, String> {
        val trimmed = query.trim()
        if (trimmed == "") return Ok(listOf())
        return tokenizeImpl(trimmed)
//        val split = trimmed.split(Regex("\\s+"))
//        val tokens = split.flatMap { detachParentheses(it) }.map {
//            when (val lowercase = it.lowercase()) {
//                "(" -> QueryToken.Parentheses.Opening
//                ")" -> QueryToken.Parentheses.Closing
//                "and" -> QueryToken.Operator.And
//                "or" -> QueryToken.Operator.Or
//                "not" -> QueryToken.Operator.Not
//                else -> {
//                    if (lowercase.contains(':')) QueryToken.KeyValue(lowercase.substringBefore(':'), lowercase.substringAfter(':'))
//                    else QueryToken.Raw(lowercase)
//                }
//            }
//        }

//        return tokens
    }

    // Handles parsing of "" and \
    private fun tokenizeImpl(query: String): Result<List<QueryToken>, String> {
        val tokens = mutableListOf<QueryToken>()
        var currentString = StringBuilder()
        // If we are within quotes (""), treat everything literally
        var openedQuote = false
        // If we just did <key>: we need to treat the next thing as the value of that key
        var specifiedKey: String? = null

        fun terminateExpression(allowOperators: Boolean) {
            if (currentString.isNotEmpty()) {
                val string = currentString.toString()
                val token = when {
                    specifiedKey != null -> {
                        // There's a "<key>:" - treat it as a key value
                        val kv = QueryToken.KeyValue(specifiedKey!!, string)
                        specifiedKey = null
                        kv
                    }
                    // Allow operators - check for operators as well
                    allowOperators -> resolveTokenFromExpression(string)
                    // No operators - it's a raw string
                    else -> QueryToken.Raw(string)
                }
                tokens.add(token)
                currentString = StringBuilder()
            }
        }


        for (i in query.indices) {
            val char = query[i]
            when {
                char == Quote -> {
                    val escaped = i != 0 && query[i - 1] == Backslash
                    if (escaped) {
                        // Quote escaped - add it literally
                        currentString.append(char)
                    } else {
                        if (openedQuote) {
                            // Quote end - add everything raw
                            terminateExpression(allowOperators = false)
                            openedQuote = false
                        } else {
                            // Quote start - terminate previous expression and mark as start of quote
                            terminateExpression(allowOperators = true)
                            openedQuote = true
                        }
                    }
                }

                char == Backslash && i != query.length - 1 && query[i + 1] == Quote -> {
                    // Backslash before quote - do nothing. The quote will make sure to have special logic regarding this backslash (above code)
                }

                openedQuote -> {
                    // Within a quote - add it literally
                    currentString.append(char)
                }

                char == ':' -> {
                    if (specifiedKey != null) {
                        return Err("Key-value expression was specified with ':' but no value was given")
                    }
                    // Specified key - mark it
                    specifiedKey = if (currentString.isNotEmpty()) {
                        // : attached to something directly - use it
                        val str = currentString.toString()
                        currentString = StringBuilder()
                        str
                    } else {
                        // Try to get the previous token as a string
                        if (tokens.isEmpty()) {
                            return Err("Key-value expression was specified with ':' but no key was given")
                        } else {
                            val lastToken = tokens.last()
                            if (lastToken !is QueryToken.Raw) {
                                return Err("Non-literal expression given as key with ':'. Use quotes if needed")
                            }
                            // Last value was raw - use its text, but exclude it from the list because it should part of the key-value
                            tokens.removeLast()
                            lastToken.text
                        }
                    }

                }
                // Space - terminate expression
                char == ' ' -> terminateExpression(allowOperators = true)
                char == '(' || char == ')' -> {
                    // Parentheses - terminate expression and add token
                    terminateExpression(allowOperators = true)
                    if (specifiedKey != null) {
                        return Err("Parentheses can't be used as value of ':' expression")
                    }

                    tokens.add(
                        when (char) {
                            '(' -> QueryToken.Parentheses.Opening
                            ')' -> QueryToken.Parentheses.Closing
                            else -> error("Impossible")
                        }
                    )
                }

                else -> {
                    // Not a special character - add it literally
                    currentString.append(char)
                }
            }
        }

        // Add what is left
        terminateExpression(allowOperators = true)

        if (openedQuote) {
            return Err("A quote was not closed")
        } else if (specifiedKey != null) {
            return Err("Key-value expression was specified with ':' but no value was given")
        } else {
            return Ok(tokens)
        }

    }

    private fun resolveTokenFromExpression(expression: String) = when (expression.lowercase()) {
        "and" -> QueryToken.Operator.And
        "or" -> QueryToken.Operator.Or
        "not" -> QueryToken.Operator.Not
        else -> QueryToken.Raw(expression)
//            if (lowercase.contains(':')) QueryToken.KeyValue(lowercase.substringBefore(':'), lowercase.substringAfter(':'))
//            else
//        }
    }

    // This takes parentheses that are attached to tokens (    e.g. (amar  ,  test)    )
    // and turns them into separate tokens: ( amar , test )
    private fun detachParentheses(string: String): List<String> {
        return when {
            // If it's just the parentheses keep it as is
            string.length == 1 -> listOf(string)


            // Add opening/closing parentheses as separate items when they are stuck to the front/end of query parts.
            string.startsWith('(') -> {
                // Include all leading parentheses separately
                var parenCount = 0
                // Get all parentheses BEFORE the string
                for (char in string) {
                    if (char == '(') parenCount++
                    else break
                }
                // Add opening parentheses as separate items
                List(parenCount) { "(" } + string.substring(parenCount)
            }

            string.endsWith(')') -> {
                // Include all trailing parentheses separately
                var parenCount = 0
                // Get all parentheses AFTER the string
                for (char in string.reversed()) {
                    if (char == ')') parenCount++
                    else break
                }
                // Add closing parentheses after as separate items
                listOf(string.substring(0, string.length - parenCount)) + List(parenCount) { ")" }
            }

            else -> listOf(string)
        }
    }

}

public sealed interface QueryToken {
    public enum class Operator : QueryToken {
        Or, And, Not
    }

    public sealed interface WithContent : QueryToken

    public enum class Parentheses : QueryToken {
        Opening, Closing
    }

    public data class KeyValue(val key: String, val value: String) : WithContent {
        override fun toString(): String = "$key:$value"
    }

    public data class Raw(val text: String) : WithContent {
        override fun toString(): String = text
    }
}