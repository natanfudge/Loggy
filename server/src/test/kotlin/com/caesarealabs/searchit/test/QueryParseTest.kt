package com.caesarealabs.searchit.test

import com.caesarealabs.searchit.impl.SearchitFilter
import com.caesarealabs.searchit.impl.SearchitFilter.*
import com.caesarealabs.searchit.impl.SearchitQuery
import com.github.michaelbull.result.Ok
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
//        "levelExact:warn".assertParse(TestItemPart.Severity(LogLine.Severity.Warn, exact = true))
//        "level:info".assertParse(TestItemPart.Severity(LogLine.Severity.Info, exact = false))
        "levelExact:warn".assertParse { listOf(Special(exactSeverityFilterMap.getValue(TestItemPart.Severity.Warn))) }
        "level:info".assertParse { listOf(Special(atLeastSeverityFilterMap.getValue(TestItemPart.Severity.Info))) }
        "amar".assertParse(Text("amar"))
        "from:lastweek to:yesterday".assertParse(from = nowGmt().startOfDay().minusWeeks(1), to = nowGmt().endOfDay().minusDays(1))
        "from:1/1/23".assertParse(from = ZonedDateTime.of(2023, 1, 1, 0, 0, 0, 0, GMTZoneId))
        "one and two".assertParse(Text("one"), Text("two"))
        "one or two".assertParse(Or(Text("one"), Text("two")))
        "not two".assertParse(Not(Text("two")))

        "(filename:dog.jpg and levelExact:warn) or (level:info not amar) from:lastweek to:yesterday"
            .assertParse(from = nowGmt().startOfDay().minusWeeks(1), to = nowGmt().endOfDay().minusDays(1)) {
                listOf(
                    Or(
                        And(KeyValue("filename", "dog.jpg"), Special(exactSeverityFilterMap.getValue(TestItemPart.Severity.Warn))),
                        And(Special(atLeastSeverityFilterMap.getValue(TestItemPart.Severity.Info)), Not(Text("amar")))
                    )
                )
            }
    }

    private fun String.assertParse(
        vararg assertFilters: SearchitFilter, from: ZonedDateTime = nowGmt().startOfDay(), to: ZonedDateTime = nowGmt().endOfDay()
    ) = assertParse(from, to) { assertFilters.toList() }

    private fun String.assertParse(
        from: ZonedDateTime = nowGmt().startOfDay(), to: ZonedDateTime = nowGmt().endOfDay(), assertFilters: () -> List<SearchitFilter>
    ) = expectThat(TestQueryParser.parseQuery(this))
        .isA<Ok<SearchitQuery>>()
        .get { value }
        .and {
            get { timeRange }
                .and { get { start }.isEqualTo(from.toInstant()) }
                .get { end }.isEqualTo(to.toInstant())
        }
        .get { filters }.isEqualTo(assertFilters().toList())
}

internal fun nowGmt() = Instant.now().toGmtDateTime()
internal val Gmt = ZoneId.of("GMT")
internal fun ZonedDateTime.startOfDay(): ZonedDateTime =
    ZonedDateTime.of(year, monthValue, dayOfMonth, 0, 0, 0, 0, Gmt)

internal fun ZonedDateTime.endOfDay(): ZonedDateTime = ZonedDateTime.of(
    year, monthValue, dayOfMonth, 23, 59, 59, 999_999_999,
    Gmt
)
