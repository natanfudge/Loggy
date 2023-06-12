package natanfudge.io

import com.github.michaelbull.result.Ok
import io.github.natanfudge.logs.impl.LogLine
import io.github.natanfudge.logs.impl.search.LogFilter
import io.github.natanfudge.logs.impl.search.LogFilter.*
import io.github.natanfudge.logs.impl.search.LogQuery
import io.github.natanfudge.logs.impl.search.QueryParser
import io.github.natanfudge.logs.impl.search.TimeRange
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime

class QueryParseTest {
    @Test
    fun testParse() {
        "filename:dog.jpg".assertParse(KeyValue("filename", "dog.jpg"))
        "levelExact:warn".assertParse(Severity(LogLine.Severity.Warn, exact = true))
        "level:info".assertParse(Severity(LogLine.Severity.Info, exact = false))
        "amar".assertParse(Text("amar"))
        "from:lastweek to:yesterday".assertParse(from = nowGmt().startOfDay().minusWeeks(1), to = nowGmt().endOfDay().minusDays(1))
        "one and two".assertParse(Text("one"), Text("two"))
        "one or two".assertParse(Or(Text("one"), Text("two")))
        "not two".assertParse(Not(Text("two")))

        "(filename:dog.jpg and levelExact:warn) or (level:info not amar) from:lastweek to:yesterday"
            .assertParse(Or(
                And(KeyValue("filename", "dog.jpg"), Severity(LogLine.Severity.Warn, exact = true)),
                And(Severity(LogLine.Severity.Info, exact = false), Not(Text("amar")))
            ), from = nowGmt().startOfDay().minusWeeks(1), to = nowGmt().endOfDay().minusDays(1))
    }

    private fun String.assertParse(
        vararg assertFilters: LogFilter, from: ZonedDateTime = nowGmt().startOfDay(), to: ZonedDateTime = nowGmt().endOfDay()
    ) = expectThat(QueryParser.parseLogQuery(this))
        .isA<Ok<LogQuery>>()
        .get { value }
        .and {
            get { timeRange }
                .and { get { start }.isEqualTo(from.toInstant()) }
                .get { end }.isEqualTo(to.toInstant())
        }
        .get { filters }.isEqualTo(assertFilters.toList())
}

internal fun nowGmt() = Instant.now().toGmtDateTime()
internal val Gmt = ZoneId.of("GMT")
internal fun ZonedDateTime.startOfDay(): ZonedDateTime =
    ZonedDateTime.of(year, monthValue, dayOfMonth, 0, 0, 0, 0, Gmt)

internal fun ZonedDateTime.endOfDay(): ZonedDateTime = ZonedDateTime.of(
    year, monthValue, dayOfMonth, 23, 59, 59, 999_999_999,
    Gmt
)
