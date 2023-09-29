package io.github.natanfudge.logs.impl

import com.caesarealabs.searchit.*
import io.objectbox.Box
import java.time.Instant

internal suspend fun Box<LogEventEntity>.loggySearch(request: GetLogsRequest): SearchitResult<LogEvent> {
    return loggySearchContext(this, request.endpoint).search(request.query, request.page)
}

private fun loggySearchContext(box: Box<LogEventEntity>, endpoint: String) = SearchitContext(
    ObjectBoxDatabase(box, endpoint),
    LogEventDataLens,
    listOf(ExactSeverityFilter, AtLeastSeverityFilter)
)



private class ObjectBoxDatabase(private val box: Box<LogEventEntity>, private val endpoint: String) : Database<LogEvent> {
    override suspend fun query(timeRange: TimeRange): List<LogEvent> {
        val timeFilter = LogEventEntity_.startTime.between(timeRange.start.toEpochMilli(), timeRange.end.toEpochMilli())
        val objectBoxQuery = if (isAllEndpoint(endpoint)) {
            // If 'all' endpoint is specified, don't filter by endpoint, just return everything within the time range
            timeFilter
        } else {
            LogEventEntity_.name.equal(endpoint).and(timeFilter)
        }
        return box.query(objectBoxQuery).build().use { it.find() }.map { it.toLogEvent() }
    }
}

private object LogEventDataLens : DataLens<LogEvent, Instant> {
    override fun hasKeyValue(item: LogEvent, key: String, value: String): Boolean {
        return item.logs.any { it is LogLine.Detail && it.key.equals(key, ignoreCase = true) && it.value.equals(value, ignoreCase = true) }
    }

    override fun sortKey(item: LogEvent): Comparable<Instant> {
        return item.startTime
    }

    override fun containsText(item: LogEvent, text: String): Boolean {
        return item.logs.any {
            when (it) {
                // Search for the text in the key/value for details
                is LogLine.Detail -> it.key.contains(text, ignoreCase = true) || it.value.contains(text, ignoreCase = true)
                // Search for the text in the message contents for messages
                is LogLine.Message -> it.message.contains(text, ignoreCase = true)
            }
        }
    }
}

private val ExactSeverityFilter = SpecialFilter<LogEvent>("levelExact") { severityString ->
    val severity = resolveSeverity(severityString) ?: return@SpecialFilter null
    { it.getSeverity() == severity }
}

private val AtLeastSeverityFilter = SpecialFilter<LogEvent>("level") { severityString ->
    val severity = resolveSeverity(severityString) ?: return@SpecialFilter null
    { it.getSeverity() >= severity }
}

private fun resolveSeverity(severityString: String): LogLine.Severity? {
    return when (severityString) {
        "verbose" -> LogLine.Severity.Verbose
        "debug" -> LogLine.Severity.Debug
        "info" -> LogLine.Severity.Info
        "warn", "warning" -> LogLine.Severity.Warn
        "error" -> LogLine.Severity.Error
        else -> null
    }
}

//logEvent.logs.any { it is LogLine.Detail && it.key.equals(key, ignoreCase = true) && it.value.equals(value, ignoreCase = true) }