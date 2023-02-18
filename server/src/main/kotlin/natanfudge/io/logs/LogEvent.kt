@file:UseSerializers(InstantSerializer::class)

package natanfudge.io.logs


import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers
import java.time.Instant



@Serializable
internal data class LogEvent(val name: String, val startTime: Instant, val endTime: Instant, val logs: List<LogLine>)

@Serializable
@PublishedApi internal sealed interface LogLine {
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
        data class Error(override val message: String, override val time: Instant, val exception: SerializableThrowable) :
            Message {
            override val severity: Severity = Severity.Error
        }
    }

    enum class Severity {
        Info, Warn, Error
    }

    @SerialName("DetailLog")
    @Serializable
    data class Detail(val key: String, val value: String) : LogLine
}

