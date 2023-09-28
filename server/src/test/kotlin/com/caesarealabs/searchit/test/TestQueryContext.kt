package com.caesarealabs.searchit.test

import com.caesarealabs.searchit.*
import com.caesarealabs.searchit.impl.QueryParser
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.Instant


/**
 * This file contains an implementation for a SearchitContext similar to the one used in Loggy for testing.
 */


/**
 * Query parser with Loggy's special filters for testing
 */
internal val TestQueryParser = QueryParser(listOf(ExactSeverityFilter, AtLeastSeverityFilter))



data class TestItem(val name: String, val startTime: Instant, val endTime: Instant, val logs: List<TestItemPart>)

internal fun TestItem.getSeverity(): TestItemPart.Severity {
    if (logs.any { it.isError }) return TestItemPart.Severity.Error
    if (logs.any { it.isWarning }) return TestItemPart.Severity.Warn
    return TestItemPart.Severity.Info
}


internal val TestItemPart.isError get() = this is TestItemPart.Message.Error
internal val TestItemPart.isWarning get() = this is TestItemPart.Message && severity == TestItemPart.Severity.Warn

sealed interface TestItemPart {
    sealed interface Message : TestItemPart {
        val message: String
        val time: Instant
        val severity: Severity

        data class Normal(
            override val message: String,
            override val time: Instant,
            override val severity: Severity
        ) : Message

        data class Error(
            override val message: String,
            override val time: Instant,
            val exception: Throwable
        ) :
            Message {
            override val severity: Severity = Severity.Error
        }
    }

    enum class Severity {
        Info, Warn, Error
    }

    @SerialName("DetailLog")
    @Serializable
    data class Detail(val key: String, val value: String) : TestItemPart
}

/**
 * We cache the functions we return as the filters so we can test they exist in tests
 */
val exactSeverityFilterMap = mutableMapOf<TestItemPart.Severity, Filter<Any?>>()
val atLeastSeverityFilterMap = mutableMapOf<TestItemPart.Severity, Filter<Any?>>()


/**
 * Copied verbatim from Loggy
 */
private val ExactSeverityFilter
    get() = SpecialFilter<TestItem>("levelExact") { severityString ->
        val severity = resolveSeverity(severityString) ?: return@SpecialFilter null
        exactSeverityFilterMap.computeIfAbsent(severity) { { (it as TestItem).getSeverity() == severity } }
    }

private val AtLeastSeverityFilter
    get() = SpecialFilter<TestItem>("level") { severityString ->
        val severity = resolveSeverity(severityString) ?: return@SpecialFilter null
        atLeastSeverityFilterMap.computeIfAbsent(severity) { { (it as TestItem).getSeverity() >= severity } }
    }

private fun resolveSeverity(severityString: String): TestItemPart.Severity? {
    return when (severityString) {
        "info" -> TestItemPart.Severity.Info
        "warn", "warning" -> TestItemPart.Severity.Warn
        "error" -> TestItemPart.Severity.Error
        else -> null
    }
}



object TestDataLens : DataLens<TestItem, Instant> {
    override fun hasKeyValue(item: TestItem, key: String, value: String): Boolean {
        return item.logs.any { it is TestItemPart.Detail && it.key.equals(key, ignoreCase = true) && it.value.equals(value, ignoreCase = true) }
    }

    override fun sortKey(item: TestItem): Comparable<Instant> {
        return item.startTime
    }

    override fun containsText(item: TestItem, text: String): Boolean {
        return item.logs.any {
            when (it) {
                // Search for the text in the key/value for details
                is TestItemPart.Detail -> it.key.contains(text, ignoreCase = true) || it.value.contains(text, ignoreCase = true)
                // Search for the text in the message contents for messages
                is TestItemPart.Message -> it.message.contains(text, ignoreCase = true)
            }
        }
    }
}


