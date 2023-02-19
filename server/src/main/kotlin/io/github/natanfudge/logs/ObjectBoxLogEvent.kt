@file:OptIn(ExperimentalSerializationApi::class)

package io.github.natanfudge.logs

import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id
import io.objectbox.annotation.Index
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.protobuf.ProtoBuf
import java.time.Instant
import java.util.*

//@Entity
//internal data class EndpointMetadata(
//    @Id var id: Long = 0,
//    @Index val endpoint: String = ""
//)

@Entity
internal data class ObjectBoxLogEvent(
    @Id var id: Long = 0,
    @Index var name: String = "",
    @Index val startTime: Long = 0,
    var endTime: Long = 0,
    var logsProtobuf: ByteArray = ByteArray(0)
) {
    override fun equals(other: Any?): Boolean {
        return other is ObjectBoxLogEvent && id == other.id
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }

    override fun toString(): String {
        return "#$id: '$name', $startTime -> $endTime (${logsProtobuf.size} bytes)"
    }
}

private val protobuf = ProtoBuf
private val logLinesSerializer = ListSerializer(LogLine.serializer())


internal fun ObjectBoxLogEvent.toLogEvent() = LogEvent(
    name,
    Instant.ofEpochMilli(startTime),
    Instant.ofEpochMilli(endTime),
    protobuf.decodeFromByteArray(logLinesSerializer, logsProtobuf)
)

@PublishedApi
internal fun LogEvent.toObjectBox(): ObjectBoxLogEvent = ObjectBoxLogEvent(
    0,
    name,
    startTime.toEpochMilli(),
    endTime.toEpochMilli(),
    protobuf.encodeToByteArray(logLinesSerializer, logs)
)

