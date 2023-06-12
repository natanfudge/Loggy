package natanfudge.io

import com.github.michaelbull.result.Ok
import io.github.natanfudge.logs.LogContext
import io.github.natanfudge.logs.Loggy
import io.github.natanfudge.logs.impl.LogEvent
import io.github.natanfudge.logs.impl.LoggingCredentials
import io.github.natanfudge.logs.impl.search.LogQuery
import io.github.natanfudge.logs.impl.search.QueryParser
import io.github.natanfudge.logs.impl.search.searchInMemory
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.map
import java.nio.file.Files
import kotlin.system.measureTimeMillis
import kotlin.test.Test

class SearchTest {

    private val loggy = Loggy.create(logToConsole = false, Files.createTempDirectory("searchTest"), LoggingCredentials(charArrayOf(), charArrayOf()))

    private fun builtLog(callName: String, call: LogContext.() -> Unit): LogEvent {
        var log: LogEvent? = null
        loggy.startCall(callName) {
            call()
            log = __test_buildLog()
        }
        return log!!
    }

    private val testLogs = listOf(
        builtLog("0") {
            logInfo { "Hello there keepo123" }
        },
        builtLog("1") {
            logInfo { "Hello there" }
        },
        builtLog("2") {
            logWarn { "The end is coming" }
        },
        builtLog("3") {
            logError(NullPointerException("")) { "I warned you" }
        },
        builtLog("4") {
            logInfo { "We're gonna try to destroy the performance".repeat(10000) }
        },
        builtLog("5") {
            logData("age") { 25 }
        },
        builtLog("6") {
            logData("age") { 26 }
            logInfo { "Amar" }
            logData("Brain") { "big" }
        },
        builtLog("7") {
            logData("amEr") {27}
        },
        builtLog("8") {
            logInfo { "inf" }
            logError(NullPointerException("")) {"amar"}
        }

    )

    @Test
    fun testSearch() {
        val time = measureTimeMillis {
            "keepo123".assertResultsAre(0)
            "hello".assertResultsAre(0, 1)
            "amir".assertResultsAre()

            "level:warn".assertResultsAre(2, 3, 8)
            "levelExact:warn".assertResultsAre(2)

            "age:25".assertResultsAre(5)

            "keepo123 or level:warn".assertResultsAre(0, 2, 3, 8)
            "age:25 or levelExact:warn".assertResultsAre(2, 5)

            "(keepo123 or level:warn) and (age:25 or levelExact:warn)".assertResultsAre(2)
            "age:25 or age:26".assertResultsAre(5, 6)
            "amer:27".assertResultsAre(7)

            "levelExact:info".assertResultsAre(0,1,4,5,6,7)
        }

        println("Did queries in $time ms")
    }

    private fun String.assertResultsAre(vararg results: Int) {
        val parsed = QueryParser.parseLogQuery(this)
        expectThat(parsed).isA<Ok<LogQuery>>()
        parsed as Ok<LogQuery>
        expectThat(testLogs.searchInMemory(parsed.value.filters))
            .map { it.name.toInt() }
            .isEqualTo(results.toList())
    }
}