package io.github.natanfudge.logs.impl

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.time.Instant
import java.time.ZoneId


internal object InstantSerializer : KSerializer<Instant> {
    override val descriptor: SerialDescriptor = Long.serializer().descriptor

    override fun deserialize(decoder: Decoder): Instant = Instant.ofEpochMilli(decoder.decodeLong())

    override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeLong(value.toEpochMilli())
}


internal typealias SerializableThrowable = List<SerializableThrowableElement>

@Serializable
internal data class SerializableThrowableElement(val className: String, val message: String, val stacktrace: String)

@PublishedApi internal fun Throwable.toSerializable(): SerializableThrowable {
    val elements = mutableListOf<SerializableThrowableElement>()
    var current: Throwable? = this
    while (current != null) {
        elements.add(current.selfToSerializable())
        current = current.cause
    }
    return elements
}

private fun Throwable.selfToSerializable() : SerializableThrowableElement {
    return SerializableThrowableElement(this::class.qualifiedName!!, message ?: "", stackTraceToString())
}

internal fun getResourceBytes(path: String): ByteArray? =
    FancyLogger::class.java.getResourceAsStream(path)?.readBytes()

internal val GMTZoneId = ZoneId.of("GMT")