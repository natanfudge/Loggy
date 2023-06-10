package natanfudge.io

import com.github.michaelbull.result.Err
import io.github.natanfudge.logs.impl.search.QueryParser
import io.github.natanfudge.logs.impl.search.QueryToken
import io.github.natanfudge.logs.impl.search.QueryTokenizer
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo

class QueryValidationTest {


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

    @Test
    fun testValidateDateContent() {
        val result1 = QueryParser.parseLogQuery("from:1/2/3/4")
        val result2 = QueryParser.parseLogQuery("from:1/")
        val result3 = QueryParser.parseLogQuery("from:foo")
        val result4 = QueryParser.parseLogQuery("from:1/bar")
        val result5 = QueryParser.parseLogQuery("from:2/3/baz")
        val result6 = QueryParser.parseLogQuery("from:2/3/1990/")
        val result7 = QueryParser.parseLogQuery("from:2/30/1990")
        val result8 = QueryParser.parseLogQuery("from:40/3/1990")
        val result9 = QueryParser.parseLogQuery("from:20/3/1990 to:19/3/1990")


        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()
        expectThat(result4)
            .isA<Err<*>>()
        expectThat(result5)
            .isA<Err<*>>()
        expectThat(result6)
            .isA<Err<*>>()
        expectThat(result7)
            .isA<Err<*>>()
        expectThat(result8)
            .isA<Err<*>>()
        expectThat(result9)
            .isA<Err<*>>()

    }
}