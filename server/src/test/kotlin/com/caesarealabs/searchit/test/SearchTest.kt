package com.caesarealabs.searchit.test

import com.caesarealabs.searchit.impl.SearchitQuery
import com.caesarealabs.searchit.impl.searchInMemory
import com.github.michaelbull.result.Ok
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.map
import java.time.Instant
import kotlin.system.measureTimeMillis
import kotlin.test.Test

class SearchTest {


    private fun buildLog(callName: String, call: TestItemContext.() -> Unit): TestItem {
        return TestItemContext(callName, Instant.now()).apply(call).buildLog()
    }

    private val testLogs = listOf(
        buildLog("0") {
            logInfo { "Hello there keepo123" }
        },
        buildLog("1") {
            logInfo { "Hello there" }
        },
        buildLog("2") {
            logWarn { "The end is coming" }
        },
        buildLog("3") {
            logError(NullPointerException("")) { "I warned you" }
        },
        buildLog("4") {
            logInfo { "We're gonna try to destroy the performance".repeat(10000) }
        },
        buildLog("5") {
            logData("age") { 25 }
        },
        buildLog("6") {
            logData("age") { 26 }
            logInfo { "Amar" }
            logData("Brain") { "big" }
        },
        buildLog("7") {
            logData("amEr") { 27 }
        },
        buildLog("8") {
            logInfo { "inf" }
            logError(NullPointerException("")) { "amar" }
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

            "levelExact:info".assertResultsAre(0, 1, 4, 5, 6, 7)
        }

        println("Did queries in $time ms")
    }

    private fun String.assertResultsAre(vararg results: Int) {
        val parsed = TestQueryParser.parseQuery(this)
        expectThat(parsed).isA<Ok<SearchitQuery>>()
        parsed as Ok<SearchitQuery>
        with(TestDataLens) {
            expectThat(testLogs.searchInMemory(parsed.value.filters))
                .map { it.name.toInt() }
                .isEqualTo(results.toList())
        }

    }
}

private class TestItemContext(private val name: String, private val startTime: Instant) {
    val logDetails: MutableList<TestItemPart> = mutableListOf()

    inline fun logInfo(message: () -> String) {
        logDetails.add(TestItemPart.Message.Normal(message(), Instant.now(), TestItemPart.Severity.Info))
    }

    inline fun logWarn(message: () -> String) {
        logDetails.add(TestItemPart.Message.Normal(message(), Instant.now(), TestItemPart.Severity.Warn))
    }

    inline fun logError(exception: Throwable, message: () -> String) {
        logDetails.add(TestItemPart.Message.Error(message(), Instant.now(), exception))
    }

    inline fun logData(key: String, value: () -> Any?) {
        logDetails.add(TestItemPart.Detail(key, value().toString()))
    }

    fun buildLog(): TestItem = TestItem(
        name, startTime = startTime, endTime = Instant.now(), logDetails
    )
}