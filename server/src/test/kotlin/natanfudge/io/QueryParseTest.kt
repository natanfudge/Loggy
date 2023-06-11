package natanfudge.io

import com.github.michaelbull.result.Ok
import io.github.natanfudge.logs.impl.search.*
import io.github.natanfudge.logs.impl.search.QueryParser.parseLogQuery
import org.junit.Test
import strikt.api.Assertion
import strikt.api.DescribeableBuilder
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime

internal fun Instant.toGmtDateTime() = ZonedDateTime.ofInstant(this, GMTZoneId)
internal val GMTZoneId = ZoneId.of("GMT")

class QueryParseTest {
    @Test
    fun testTokenization() {
        expectThat(QueryTokenizer.tokenize(""))
            .isEqualTo(listOf())
        expectThat(QueryTokenizer.tokenize(" "))
            .isEqualTo(listOf())
        expectThat(QueryTokenizer.tokenize("key:value and (foo or bar)"))
            .isEqualTo(QueryTokenizer.tokenize("key:value and ( foo or bar )"))
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
        expectThat(QueryTokenizer.tokenize("key:value   and (foo  or bar)"))
            .isEqualTo(QueryTokenizer.tokenize("key:value and ( foo or bar )"))
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

        expectThat(QueryTokenizer.tokenize("((foo or k:v) bar) baz"))
            .isEqualTo(QueryTokenizer.tokenize("( ( foo or k:v ) bar ) baz"))
            .isEqualTo(
                listOf(
                    QueryToken.Parentheses.Opening,
                    QueryToken.Parentheses.Opening,
                    QueryToken.Raw("foo"),
                    QueryToken.Operator.Or,
                    QueryToken.KeyValue("k","v"),
                    QueryToken.Parentheses.Closing,
                    QueryToken.Raw("bar"),
                    QueryToken.Parentheses.Closing,
                    QueryToken.Raw("baz")
                )
            )

//        ((foo or k:v) bar) baz
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