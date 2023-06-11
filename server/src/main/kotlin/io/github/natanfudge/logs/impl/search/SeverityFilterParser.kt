package io.github.natanfudge.logs.impl.search

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import io.github.natanfudge.logs.impl.LogLine
import io.github.natanfudge.logs.impl.splitBy

internal object SeverityFilterParser  {
    private const val InfoSeverity = "info"
    private const val WarningSeverity1 = "warn"
    private const val WarningSeverity2 = "warning"
    private const val ErrorSeverity = "error"

    private val severities = setOf(InfoSeverity, WarningSeverity1, WarningSeverity2, ErrorSeverity)

    fun isInvalidSeverity(key: String, value: String) = isSeverityFilter(key) && value !in severities

    /**
     * Returns null if the key is not a severity filter
     */
    fun parseSeverity(key: String, value: String): LogFilter.Severity? {
        val exact = when(key) {
            AtLeastSeverityFilter -> false
            SeverityExactFilter -> true
            else -> return null
        }
        val severity = when(value) {
            "info" -> LogLine.Severity.Info
            "warn", "warning" -> LogLine.Severity.Warn
            "error" -> LogLine.Severity.Error
            else -> error("Invalid severity $value, this should not be accepted")
        }
        return LogFilter.Severity(severity, exact)
    }

    private fun isSeverityFilter(key : String) = key == AtLeastSeverityFilter || key == SeverityExactFilter



    private const val AtLeastSeverityFilter = "level"
    private const val SeverityExactFilter = "levelExact"
//
//    internal fun List<String>.parseSeverityFilters(): Pair<List<LogFilter.Severity>, List<String>> {
//        val (severityStrings, nonSeverityFilters) = splitByIsSeverityFilter()
//        val severities = resolveSeverities(parseSeverities(severityStrings)).map { LogFilter.Severity(it) }
//        return severities to nonSeverityFilters
//    }
//
//    private fun List<String>.splitByIsSeverityFilter(): Pair<List<String>, List<String>> = splitBy {
//        // Only puts level: and levelExact: in the first item of the pair
//        if (!it.contains(":")) false
//        else {
//            val tagKey = it.substringBefore(":")
//            tagKey == AtLeastSeverityFilterAA || tagKey == SeverityExactFilterAA
//        }
//    }
//
//    private fun parseSeverities(severityFilters: List<String>) = severityFilters.mapNotNull { severityFilter ->
//        val exact = severityFilter.startsWith(SeverityExactFilterAA)
//        val severityString = severityFilter.removeSuffix(AtLeastSeverityFilterAA).removeSuffix(SeverityExactFilterAA)
//        val severity = when (severityString.lowercase()) {
//            "info" -> LogLine.Severity.Info
//            "warn", "warning" -> LogLine.Severity.Warn
//            "error" -> LogLine.Severity.Error
//            else -> null
//        }
//        severity?.let { SeverityFilterString(it, exact) }
//    }
//
//    private data class SeverityFilterString(val severity: LogLine.Severity, val exact: Boolean)
//
//    private fun resolveSeverities(logsFilters: List<SeverityFilterString>): List<LogLine.Severity> {
//        // Default: show everything
//        if (logsFilters.isEmpty()) return listOf(LogLine.Severity.Info, LogLine.Severity.Warn, LogLine.Severity.Error)
//
//        val toShow = mutableSetOf<LogLine.Severity>()
//        for (filter in logsFilters) {
//            if (filter.exact) {
//                // Exact: show that exact severity
//                toShow.add(filter.severity)
//            } else {
//                // At least: show all severities with at least that severity
//                toShow.addAll(LogLine.Severity.values().filter { it.level >= filter.severity.level })
//            }
//        }
//        return toShow.toList()
//    }

}
