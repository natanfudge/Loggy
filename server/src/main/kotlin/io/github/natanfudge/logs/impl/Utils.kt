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


public  typealias SerializableThrowable = List<SerializableThrowableElement>

@Serializable
public  data class SerializableThrowableElement(val className: String, val message: String, val stacktrace: String)

@PublishedApi
internal fun Throwable.toSerializable(): SerializableThrowable {
    val elements = mutableListOf<SerializableThrowableElement>()
    var current: Throwable? = this
    while (current != null) {
        elements.add(current.selfToSerializable())
        current = current.cause
    }
    return elements
}

private fun Throwable.selfToSerializable(): SerializableThrowableElement {
    return SerializableThrowableElement(this::class.qualifiedName!!, message ?: "", stackTraceToString())
}

internal fun getResourceBytes(path: String): ByteArray? =
    FancyLogger::class.java.getResourceAsStream(path)?.readBytes()

internal val GMTZoneId = ZoneId.of("GMT")

internal fun <T> List<T>.splitBy(predicate: (T) -> Boolean): Pair<List<T>, List<T>> {
    val matches = mutableListOf<T>()
    val doesntMatch = mutableListOf<T>()
    for (item in this) {
        if (predicate(item)) {
            matches.add(item)
        } else {
            doesntMatch.add(item)
        }
    }
    return matches to doesntMatch
}

/**
 * Returns null if more than 3 parts or this is empty string
 */
internal fun String.splitUpTo3(vararg delimiters: String): Triple<String, String?, String?>? {
    val split = split(*delimiters)
    return when(split.size) {
        1 -> Triple(split[0], null, null)
        2 -> Triple(split[0], split[1], null)
        3 -> Triple(split[0], split[1], split[2])
        else -> null
    }
}