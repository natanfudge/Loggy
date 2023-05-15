@file:OptIn(ExperimentalSerializationApi::class)

package io.github.natanfudge.logs.impl

import io.github.natanfudge.logs.impl.analytics.Analytics
import io.github.natanfudge.logs.impl.analytics.Day
import io.github.natanfudge.logs.impl.analytics.DayBreakdown
import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id
import io.objectbox.annotation.Index
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.protobuf.ProtoBuf
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime


@Entity
internal data class LogEventEntity(
    @Id var id: Long = 0,
    @Index var name: String = "",
    @Index val startTime: Long = 0,
    var endTime: Long = 0,
    var logsProtobuf: ByteArray = ByteArray(0)
) {
    override fun equals(other: Any?): Boolean {
        return other is LogEventEntity && id == other.id
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }

    override fun toString(): String {
        return "#$id: '$name', ${startTime.toSystemDate()} -> ${endTime.toSystemDate()} (${logsProtobuf.size} bytes)"
    }
}

private fun Long.toSystemDate() = ZonedDateTime.ofInstant(Instant.ofEpochMilli(this), ZoneId.systemDefault())

private val protobuf = ProtoBuf
private val logLinesSerializer = ListSerializer(LogLine.serializer())


internal fun LogEventEntity.toLogEvent() = LogEvent(
    name,
    Instant.ofEpochMilli(startTime),
    Instant.ofEpochMilli(endTime),
    protobuf.decodeFromByteArray(logLinesSerializer, logsProtobuf)
)

@PublishedApi
internal fun LogEvent.toObjectBox(): LogEventEntity = LogEventEntity(
    0,
    name,
    startTime.toEpochMilli(),
    endTime.toEpochMilli(),
    protobuf.encodeToByteArray(logLinesSerializer, logs)
)


internal fun List<LogEventEntity>.analyze(): Analytics {
    return map { dayOfUnixMs(it.startTime) to it }
        .groupBy {(day, _) -> day }
        .mapValues { (_, logsOfDay) ->
            var errors = 0
            var warnings = 0
            var infos = 0
            for((_, log) in logsOfDay) {
                val decoded = log.toLogEvent()
                // A log event counts an error/warning if there was at least one error/warning log line.
                when {
                    decoded.logs.any { it.isError } -> errors++
                    decoded.logs.any { it.isWarning } -> warnings++
                    else -> infos++
                }
            }
            DayBreakdown(errorCount = errors, warningCount = warnings, infoCount = infos)
        }
}
private fun dayOfUnixMs(ms: Long): Day {
    val datetime = ZonedDateTime.ofInstant(Instant.ofEpochMilli(ms), GMTZoneId)
    return Day(
        year = datetime.year.toUShort(),
        month = datetime.month.value.toUByte(),
        day = datetime.dayOfMonth.toUByte()
    )
}
