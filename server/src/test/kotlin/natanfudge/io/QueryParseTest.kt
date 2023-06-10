package natanfudge.io

import com.github.michaelbull.result.Err
import io.github.natanfudge.logs.impl.search.QueryParser
import io.github.natanfudge.logs.impl.search.QueryParser.QueryToken
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo

class QueryParseTest {
    @Test
    fun testTokenization() {
        expectThat(QueryParser.tokenize("key:value and (foo or bar)"))
            .isEqualTo(QueryParser.tokenize("key:value and ( foo or bar )"))
            .isEqualTo(
                listOf(
                    QueryToken.KeyValue("key", "value"),
                    QueryToken.Operator.And,
                    QueryToken.Parentheses.Opening,
                    QueryToken.Raw("foo"),
                    QueryToken.Operator.Or,
                    QueryToken.Raw("bar"),
                    QueryToken.Parentheses.Closing,
                )
            )
    }
    @Test
    fun testValidateTime() {
        val result1 = QueryParser.parseLogQuery("to:10/3 to:20/3")
        val result2 = QueryParser.parseLogQuery("foo and to:10/3")
        val result3 = QueryParser.parseLogQuery("to:10/3 and foo")
        val result4 = QueryParser.parseLogQuery("(to:10/3)")

        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()
        expectThat(result4)
            .isA<Err<*>>()

    }
    @Test
    fun testValidateOperators() {
        val result1 = QueryParser.parseLogQuery("and foo")
        val result2 = QueryParser.parseLogQuery("bar or")
        val result3 = QueryParser.parseLogQuery("foo and or bar")

        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()

    }
    @Test
    fun testValidateParentheses() {
        val result1 = QueryParser.parseLogQuery("( foo")
        val result2 = QueryParser.parseLogQuery("bar)")

        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
    }
}