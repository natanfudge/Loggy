@file:OptIn(ExperimentalSerializationApi::class)
package natanfudge.io.logs

import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.encodeToByteArray
import kotlinx.serialization.protobuf.ProtoBuf
import java.time.Instant
import kotlin.math.log

@Entity
data class ObjectBoxLogEvent(
    @Id var id: Long =0,
    var name: String = "",
    val startTime: Long = 0,
    var endTime: Long = 0,
    var logsProtobuf: ByteArray = ByteArray(0)
) {
    override fun equals(other: Any?): Boolean {
        return other is ObjectBoxLogEvent && id == other.id
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}

private val protobuf = ProtoBuf
private val logLinesSerializer = ListSerializer(LogLine.serializer())


fun ObjectBoxLogEvent.toLogEvent() = LogEvent(
    name,
    Instant.ofEpochMilli(startTime),
    Instant.ofEpochMilli(endTime),
    protobuf.decodeFromByteArray(logLinesSerializer, logsProtobuf)
)

fun LogEvent.toObjectBox() = ObjectBoxLogEvent(
    0,
    name,
    startTime.toEpochMilli(),
    endTime.toEpochMilli(),
    protobuf.encodeToByteArray(logLinesSerializer, logs)
)