package io.github.natanfudge.logs.impl.search

import io.github.natanfudge.logs.impl.LogLine
import io.github.natanfudge.logs.impl.splitBy

private const val AtLeastSeverityFilter = "level:"
private const val SeverityExactFilter = "levelExact:"

internal fun List<String>.parseSeverityFilters(): Pair<List<Filter.Severity>, List<String>> {
    val (severityStrings, nonSeverityFilters) = splitByIsSeverityFilter()
    val severities = resolveSeverities(parseSeverities(severityStrings)).map { Filter.Severity(it) }
    return severities to nonSeverityFilters
}

private fun List<String>.splitByIsSeverityFilter(): Pair<List<String>, List<String>> = splitBy {
    // Only puts level: and levelExact: in the first item of the pair
    if (!it.contains(":")) false
    else {
        val tagKey = it.substringBefore(":")
        tagKey == AtLeastSeverityFilter || tagKey == SeverityExactFilter
    }
}

private fun parseSeverities(severityFilters: List<String>) = severityFilters.mapNotNull { severityFilter ->
    val exact = severityFilter.startsWith(SeverityExactFilter)
    val severityString = severityFilter.removeSuffix(AtLeastSeverityFilter).removeSuffix(SeverityExactFilter)
    val severity = when (severityString.lowercase()) {
        "info" -> LogLine.Severity.Info
        "warn", "warning" -> LogLine.Severity.Warn
        "error" -> LogLine.Severity.Error
        else -> null
    }
    severity?.let { SeverityFilterString(it, exact) }
}

private data class SeverityFilterString(val severity: LogLine.Severity, val exact: Boolean)

private fun resolveSeverities(logsFilters: List<SeverityFilterString>): List<LogLine.Severity> {
    // Default: show everything
    if (logsFilters.isEmpty()) return listOf(LogLine.Severity.Info, LogLine.Severity.Warn, LogLine.Severity.Error)

    val toShow = mutableSetOf<LogLine.Severity>()
    for (filter in logsFilters) {
        if (filter.exact) {
            // Exact: show that exact severity
            toShow.add(filter.severity)
        } else {
            // At least: show all severities with at least that severity
            toShow.addAll(LogLine.Severity.values().filter { it.level >= filter.severity.level })
        }
    }
    return toShow.toList()
}
