package natanfudge.io.logs

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.time.Instant
import java.util.*


object InstantSerializer : KSerializer<Instant> {
    override val descriptor: SerialDescriptor = Long.serializer().descriptor

    override fun deserialize(decoder: Decoder): Instant = Instant.ofEpochMilli(decoder.decodeLong())

    override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeLong(value.toEpochMilli())
}


@Suppress("unused")
@Serializable
class ThrowableJsonRepresentation(val className: String, val message: String, val stacktrace: String)

object OneWayThrowableSerializer : KSerializer<Throwable> {
    private val serializer = ThrowableJsonRepresentation.serializer()
    override val descriptor: SerialDescriptor = serializer.descriptor

    override fun deserialize(decoder: Decoder): Throwable {
        throw UnsupportedOperationException("OneWayThrowableSerializer only serializes")
    }

    override fun serialize(encoder: Encoder, value: Throwable) {
        serializer.serialize(
            encoder,
            ThrowableJsonRepresentation(value::class.qualifiedName!!, value.message ?: "", value.stackTraceToString())
        )
    }

}

