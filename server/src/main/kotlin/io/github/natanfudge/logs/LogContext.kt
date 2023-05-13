package io.github.natanfudge.logs

import io.github.natanfudge.logs.impl.LogEvent
import io.github.natanfudge.logs.impl.LogLine
import io.github.natanfudge.logs.impl.toSerializable
import java.time.Instant

public class LogContext(private val name: String, private val startTime: Instant) {
    @PublishedApi
    internal val logDetails: MutableList<LogLine> = mutableListOf()

    public inline fun logInfo(message: () -> String) {
        logDetails.add(LogLine.Message.Normal(message(), Instant.now(), LogLine.Severity.Info))
    }

    public inline fun logWarn(message: () -> String) {
        logDetails.add(LogLine.Message.Normal(message(), Instant.now(), LogLine.Severity.Warn))
    }

    public inline fun logError(exception: Throwable, message: () -> String) {
        logDetails.add(LogLine.Message.Error(message(), Instant.now(), exception.toSerializable()))
    }

    public inline fun logData(key: String, value: () -> Any) {
        logDetails.add(LogLine.Detail(key, value().toString()))
    }

    @PublishedApi
    internal fun buildLog(): LogEvent = LogEvent(
        name, startTime = startTime, endTime = Instant.now(), logDetails
    )
}