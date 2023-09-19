package natanfudge.io

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.getOrThrow
import io.github.natanfudge.logs.impl.search.LogParseResult
import io.github.natanfudge.logs.impl.search.LogQuery
import io.github.natanfudge.logs.impl.search.QueryParser.parseLogQuery
import io.github.natanfudge.logs.impl.search.QueryToken
import io.github.natanfudge.logs.impl.search.QueryToken.*
import io.github.natanfudge.logs.impl.search.QueryTokenizer
import org.junit.Test
import strikt.api.Assertion
import strikt.api.DescribeableBuilder
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime

internal fun Instant.toGmtDateTime() = ZonedDateTime.ofInstant(this, Gmt)
internal val GMTZoneId = ZoneId.of("GMT")

class QueryIntermediateParseTest {
    @Test
    fun testTokenization() {
        expectTokenization("")
        expectTokenization(" ")
        expectTokenization(
            "key:value and (foo or bar)",
            KeyValue("key", "value"),
            Operator.And,
            Parentheses.Opening,
            Raw("foo"),
            Operator.Or,
            Raw("bar"),
            Parentheses.Closing,
        ).sameAs("key:value and ( foo or bar )")

        expectTokenization(
            "key:value   and (foo  or bar)",
            KeyValue("key", "value"),
            Operator.And,
            Parentheses.Opening,
            Raw("foo"),
            Operator.Or,
            Raw("bar"),
            Parentheses.Closing,
        ).sameAs("key:value and ( foo or bar )")

        expectTokenization(
            "((foo or k:v) bar) baz", Parentheses.Opening,
            Parentheses.Opening,
            Raw("foo"),
            Operator.Or,
            KeyValue("k", "v"),
            Parentheses.Closing,
            Raw("bar"),
            Parentheses.Closing,
            Raw("baz")
        ).sameAs("( ( foo or k:v ) bar ) baz")

        expectTokenization("Keep Case", Raw("Keep"), Raw("Case"))

    }
    //TODO: test operators and quotes interaction

    @Test
    fun spacedKeyValueTest() {
        expectTokenization("key: value", KeyValue("key", "value"))
            .sameAs("key : value")
            .sameAs("key :value")
        expectTokenization("key \":\" value", Raw("key"), Raw(":"), Raw("value"))

        expectTokenization(""" "even : can be used as key": "value !:" """, KeyValue("even : can be used as key", "value !:"))

        expectTokenizationFail(": without key")
        expectTokenizationFail(" : without key")
        expectTokenizationFail("without value:")
        expectTokenizationFail("without value :")
        expectTokenizationFail("hello :: double colon")

        expectTokenizationFail("something:weird:going")
        expectTokenizationFail("something :weird: going")
        expectTokenizationFail("something:weird: going")
        expectTokenizationFail("something:weird :going")
        expectTokenizationFail("paren):for some reason")
        expectTokenizationFail("paren( :for some reason")

        expectTokenizationFail("paren: (for some reason")
        expectTokenizationFail("paren:)for some reason")
    }


    @Test
    fun quoteTokenizationTest() {
        expectTokenization(""" "hello there"   """, Raw("hello there"))
        expectTokenization(""" "hello:there" """, Raw("hello:there"))
        expectTokenization(""" "hello:  there" """, Raw("hello:  there"))
        expectTokenization(""" "hello:  there" """, Raw("hello:  there"))

        expectTokenization(""" "a" and "b"   """, Raw("a"), Operator.And, Raw("b"))
        expectTokenization(""" "a" "and" "b"   """, Raw("a"), Raw("and"), Raw("b"))

        expectTokenizationFail("""  "unqouted start """)
        expectTokenizationFail("""  unqouted end" """)
        expectTokenizationFail("""  " unqouted start """)
        expectTokenizationFail("""  unqouted end " """)

        expectTokenizationFail("""  "unqouted start\" """)
        expectTokenizationFail("""  \"unqouted end" """)
        expectTokenizationFail("""  " unqouted start\" """)
        expectTokenizationFail("""  \"unqouted end " """)

        expectTokenizationFail(""" "hello: " there" """)
        expectTokenization(""" "hello: \" there" """, Raw("""hello: " there"""))

        expectTokenization(""" key:"spaced value" """, KeyValue("key", "spaced value"))
        expectTokenization(""" "spaced key":"spaced value" """, KeyValue("spaced key", "spaced value"))
        expectTokenization(""" "spaced key": "spaced value" """, KeyValue("spaced key", "spaced value"))

        expectTokenization("""  "multiple quotes""in one thing" """, Raw("multiple quotes"), Raw("in one thing"))
            .sameAs(""""multiple quotes" "in one thing"""")

//        expectThat(""" "hello there"   """)
//            .isEqualTo(listOf(QueryToken.))
    }

    private fun expectTokenization(query: String, vararg tokens: QueryToken): Assertion.Builder<List<QueryToken>> {
        return expectThat(QueryTokenizer.tokenize(query))
            .isA<Ok<List<QueryToken>>>()
            .get { value }
            .isEqualTo(tokens.toList())
    }

    private val showErrors = true

    private fun expectTokenizationFail(query: String) {
        expectThat(QueryTokenizer.tokenize(query))
            .isA<Err<String>>()
            .also {
                if (showErrors) {
                    it.get { println(error) }
                }
            }
    }

    private fun Assertion.Builder<List<QueryToken>>.sameAs(query: String): Assertion.Builder<List<QueryToken>> {
       return isEqualTo(QueryTokenizer.tokenize(query).getOrThrow { AssertionError("Failed to tokenize query $query: $it") })
    }

    @Test
    fun testDates() {
        val today = Instant.now().toGmtDateTime()

        parseLogQuery("")
            .expectStartsSameDay(today)
            .endIsAtSameDay(today)

        parseLogQuery("from:today")
            .expectStartsSameDay(today)
            .endIsAtSameDay(today)


        parseLogQuery("from:yesterday to:today   ")
            .expectStartsSameDay(today.minusDays(1))
            .endIsAtSameDay(today)

        parseLogQuery("from:lastWeek")
            .expectStartsSameDay(today.minusWeeks(1))

        parseLogQuery("from:lastMonth")
            .expectStartsSameDay(today.minusMonths(1))

        parseLogQuery("from:5")
            .expectStartsSameDay(today.withDayOfMonth(5))

        parseLogQuery("from:5/6")
            .expectStartsSameDay(today.withDayOfMonth(5).withMonth(6))

        parseLogQuery("from:5/6/1990")
            .expectStartsSameDay(today.withDayOfMonth(5).withMonth(6).withYear(1990))

    }

    private fun LogParseResult.expectStartsSameDay(dateTime: ZonedDateTime): Assertion.Builder<LogParseResult> {
        val expect = expectThat(this)
        expect.isA<Ok<LogQuery>>()
            .get { value.timeRange.start.toGmtDateTime() }
            .isSameDayAs(dateTime)
        return expect
    }

    private fun Assertion.Builder<LogParseResult>.endIsAtSameDay(dateTime: ZonedDateTime): Assertion.Builder<LogParseResult> {
        isA<Ok<LogQuery>>()
            .get { value.timeRange.end.toGmtDateTime() }
            .isSameDayAs(dateTime)
        return this
    }

    private fun DescribeableBuilder<ZonedDateTime>.isSameDayAs(dateTime: ZonedDateTime) =
        and {
            get { year }.isEqualTo(dateTime.year)
        }
            .and {
                get { monthValue }.isEqualTo(dateTime.monthValue)
            }
            .and {
                get { dayOfMonth }.isEqualTo(dateTime.dayOfMonth)
            }
}