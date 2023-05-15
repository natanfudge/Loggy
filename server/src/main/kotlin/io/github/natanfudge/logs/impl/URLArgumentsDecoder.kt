@file:OptIn(ExperimentalSerializationApi::class)

package io.github.natanfudge.logs.impl

import io.ktor.http.*
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.InternalSerializationApi
import kotlinx.serialization.SerializationException
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.CompositeDecoder
import kotlinx.serialization.internal.NamedValueDecoder
import kotlinx.serialization.internal.TaggedDecoder
import kotlinx.serialization.modules.EmptySerializersModule
import kotlinx.serialization.modules.SerializersModule
import java.lang.Exception


object UrlParameters {
    fun <T> decodeFromParameters(value: Parameters, deserializer: DeserializationStrategy<T>) =
        URLArgumentsDecoder(value).decodeSerializableValue(deserializer)
    fun <T> decodeSafelyFromParameters(value: Parameters, deserializer: DeserializationStrategy<T>): Result<T> = try {
        Result.success(URLArgumentsDecoder(value).decodeSerializableValue(deserializer))
    } catch (e: SerializationException) {
        Result.failure(e)
    }

}

/**
 * Decodes url arguments of the form ?x=y&z=w.
 * Nulls are not allowed.
 * Taken from ktor.
 */
@OptIn(ExperimentalSerializationApi::class, InternalSerializationApi::class)
private class URLArgumentsDecoder(
    private val parameters: Parameters,
   override val serializersModule: SerializersModule = EmptySerializersModule()
) : NamedValueDecoder() {
    private val parameterNames = parameters.names().toList()
    private val size: Int = parameterNames.size
    private var position = -1

    override fun decodeElementIndex(descriptor: SerialDescriptor): Int {
        while (position < size - 1) {
            position++
            return position
        }
        return CompositeDecoder.DECODE_DONE
    }

    private fun currentElement(tag: String): String {
        return parameters[tag] ?: throw SerializationException("Unexpected parameter name '$tag'")
    }

    override fun decodeTaggedBoolean(tag: String): Boolean {
        return currentElement(tag) == "t"
    }

    override fun decodeTaggedChar(tag: String): Char {
        return currentElement(tag)[0]
    }

    override fun decodeTaggedDouble(tag: String): Double {
        return currentElement(tag).toDouble()
    }

    override fun decodeTaggedFloat(tag: String): Float {
        return currentElement(tag).toFloat()
    }

    override fun decodeTaggedInt(tag: String): Int {
        return currentElement(tag).toInt()
    }

    override fun decodeTaggedLong(tag: String): Long {
        return currentElement(tag).toLong()
    }

    override fun decodeTaggedString(tag: String): String {
        return currentElement(tag)
    }

    override fun decodeTaggedNotNullMark(tag: String): Boolean {
        return currentElement(tag) != "#n"
    }

    override fun decodeTaggedNull(tag: String): Nothing? {
        return null
    }

    override fun decodeTaggedEnum(tag: String, enumDescriptor: SerialDescriptor): Int {
        val enumName = decodeTaggedString(tag)
        val index = enumDescriptor.getElementIndex(enumName)
        if (index == CompositeDecoder.UNKNOWN_NAME) {
            throw IllegalStateException(
                "${enumDescriptor.serialName} does not contain element with name '$enumName'"
            )
        }
        return index
    }
}
