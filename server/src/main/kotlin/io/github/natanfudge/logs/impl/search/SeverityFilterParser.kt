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
            InfoSeverity -> LogLine.Severity.Info
            WarningSeverity1, WarningSeverity2 -> LogLine.Severity.Warn
            ErrorSeverity -> LogLine.Severity.Error
            else -> error("Invalid severity $value, this should not be accepted")
        }
        return LogFilter.Severity(severity, exact)
    }

    private fun isSeverityFilter(key : String) = key == AtLeastSeverityFilter || key == SeverityExactFilter



    private const val AtLeastSeverityFilter = "level"
    private const val SeverityExactFilter = "levelexact"
}
