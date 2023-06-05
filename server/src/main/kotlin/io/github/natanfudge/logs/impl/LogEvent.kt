@file:UseSerializers(InstantSerializer::class)

package io.github.natanfudge.logs.impl


import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers
import java.time.Instant


@Serializable
internal data class LogEvent(val name: String, val startTime: Instant, val endTime: Instant, val logs: List<LogLine>)

internal fun LogEvent.getSeverity(): LogLine.Severity {
    if (logs.any { it.isError }) return LogLine.Severity.Error
    if (logs.any { it.isWarning }) return LogLine.Severity.Warn
    return LogLine.Severity.Info
}

//internal val LogEvent.anyError get() = logs.any { it.isError }
//internal val LogEvent.anyWarning get() = logs.any {  }

internal val LogLine.isError get() = this is LogLine.Message.Error
internal val LogLine.isWarning get() = this is LogLine.Message && severity == LogLine.Severity.Warn

@Serializable
@PublishedApi
internal sealed interface LogLine {
    @Serializable
    sealed interface Message : LogLine {
        val message: String
        val time: Instant
        val severity: Severity

        @Serializable
        @SerialName("MessageLog")
        data class Normal(
            override val message: String,
            override val time: Instant,
            override val severity: Severity
        ) : Message

        @Serializable
        @SerialName("ErrorLog")
        data class Error(
            override val message: String,
            override val time: Instant,
            val exception: SerializableThrowable
        ) :
            Message {
            override val severity: Severity = Severity.Error
        }
    }

    enum class Severity(val level: Int) {
        Info(2), Warn(3), Error(4)
    }

    @SerialName("DetailLog")
    @Serializable
    data class Detail(val key: String, val value: String) : LogLine
}

