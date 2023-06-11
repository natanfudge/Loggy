package natanfudge.io

import com.github.michaelbull.result.Ok
import io.github.natanfudge.logs.impl.search.LogFilter
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
        "filename:dog.jpg".assertParse(LogFilter.KeyValue("filename", "dog.jpg"))
    }

    private fun String.assertParse (
        vararg filters: LogFilter, start: ZonedDateTime = nowGmt().startOfDay(), end: ZonedDateTime = nowGmt().endOfDay()
    ) = expectThat(QueryParser.parseLogQuery(this))
        .isA<Ok<LogQuery>>()
        .get { value }
        .isEqualTo(LogQuery(TimeRange(start.toInstant(),end.toInstant()), filters.toList()))
}

internal fun nowGmt() = Instant.now().toGmtDateTime()
internal val Gmt = ZoneId.of("GMT")
internal fun ZonedDateTime.startOfDay(): ZonedDateTime =
    ZonedDateTime.of(year, monthValue, dayOfMonth, 0, 0, 0, 0, Gmt)

internal fun ZonedDateTime.endOfDay(): ZonedDateTime = ZonedDateTime.of(year, monthValue, dayOfMonth, 23, 59, 59, 999_999_999,
    Gmt
)
