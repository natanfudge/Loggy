@file:UseSerializers(InstantSerializer::class)

package io.github.natanfudge.logs.impl

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers
import java.time.Instant

// public for tests
@Serializable
public data class LogEvent(val name: String, val startTime: Instant, val endTime: Instant, val logs: List<LogLine>)

/**
 * While [LogEvent]s may not have severity by themselves, they do contain [LogLine]s that have an attached severity for each.
 * We consider the severity of an entire [LogEvent] by the maximum severity of its messages.
 * If it has no messages, the severity is considered [LogLine.Severity.Verbose].
 */
internal fun LogEvent.getSeverity(): LogLine.Severity {
    return logs.filterIsInstance<LogLine.Message>().maxOfOrNull { it.severity } ?: LogLine.Severity.Verbose
}


internal val LogLine.isError get() = this is LogLine.Message.Error
internal val LogLine.isWarning get() = this is LogLine.Message && severity == LogLine.Severity.Warn

@Serializable
public sealed interface LogLine {
    @Serializable
    public sealed interface Message : LogLine {
        public val message: String
        public val time: Instant
        public val severity: Severity

        @Serializable
        @SerialName("MessageLog")
        public data class Normal(
            override val message: String,
            override val time: Instant,
            override val severity: Severity
        ) : Message

        @Serializable
        @SerialName("ErrorLog")
        public data class Error(
            override val message: String,
            override val time: Instant,
            val exception: SerializableThrowable
        ) :
            Message {
            override val severity: Severity = Severity.Error
        }
    }

    public enum class Severity(public val level: Int) {
       Verbose(0), Debug(1), Info(2), Warn(3), Error(4)
    }

    @SerialName("DetailLog")
    @Serializable
    public data class Detail(val key: String, val value: String) : LogLine
}

