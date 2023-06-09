package io.github.natanfudge.logs.impl.search

import io.github.natanfudge.logs.impl.splitBy

//internal fun List<String>.parseDateFilters(): Pair<List<Filter.Severity>, List<String>> {
//    val (severityStrings, nonSeverityFilters) = splitByIsSeverityFilter()
//    val severities = resolveSeverities(parseSeverities(severityStrings)).map { Filter.Severity(it) }
//    return severities to nonSeverityFilters
//}
//
//private fun List<String>.splitByIsSeverityFilter(): Pair<List<String>, List<String>> = splitBy {
//    // Only puts level: and levelExact: in the first item of the pair
//    if (!it.contains(":")) false
//    else {
//        val tagKey = it.substringBefore(":")
//        tagKey == AtLeastSeverityFilter || tagKey == SeverityExactFilter
//    }
//}

internal object DateFilterParser {
    const val StartDateToken = "to"
    const val EndDateToken = "from"
}