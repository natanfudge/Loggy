package natanfudge.io.logs

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.time.Instant


internal object InstantSerializer : KSerializer<Instant> {
    override val descriptor: SerialDescriptor = Long.serializer().descriptor

    override fun deserialize(decoder: Decoder): Instant = Instant.ofEpochMilli(decoder.decodeLong())

    override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeLong(value.toEpochMilli())
}

//data class (
//    val causeChain: List<>
//)

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

//@Suppress("unused")
//@Serializable
//internal class ThrowableJsonRepresentation()
//
//internal object OneWayThrowableSerializer : KSerializer<Throwable> {
//    private val serializer = ListSerializer(ThrowableJsonRepresentation.serializer())
//    override val descriptor: SerialDescriptor = serializer.descriptor
//
//    override fun deserialize(decoder: Decoder): Throwable {
//        throw UnsupportedOperationException("OneWayThrowableSerializer only serializes")
//    }
//
//    override fun serialize(encoder: Encoder, value: Throwable) {
//        val exceptions = mutableListOf<Throwable>()
//        var current: Throwable? = value
//        while (current != null) {
//            exceptions.add(current)
//            current = current.cause
//        }
//        serializer.serialize(
//            encoder,
//            ThrowableJsonRepresentation(value::class.qualifiedName!!, value.message ?: "", value.stackTraceToString())
//        )
//    }
//
//}

