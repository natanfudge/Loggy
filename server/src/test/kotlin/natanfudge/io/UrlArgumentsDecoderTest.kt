package natanfudge.io

import io.github.natanfudge.logs.impl.UrlParameters
import io.ktor.http.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import org.junit.Test
import strikt.api.expectThat
import strikt.api.expectThrows
import strikt.assertions.isEqualTo

class UrlArgumentsDecoderTest {
    @Test
    fun testDecoding() {
        val url = Parameters.build {
            this["x"] = "amar"
            this["y"] = "123"
            this["z"] = "69420"
        }
        expectThat(UrlParameters.decodeFromParameters(url, TestClass.serializer()))
            .isEqualTo(TestClass("amar", 123, 69420))

        val url2 = Parameters.build {
            this["x"] = "amar"
            this["y"] = "123"
        }
        expectThrows<SerializationException> {
            UrlParameters.decodeFromParameters(url2, TestClass.serializer())
        }

        val url3 = Parameters.build {
            this["x"] = "amar"
            this["w"] = "123"
        }
        expectThrows<SerializationException> {
            UrlParameters.decodeFromParameters(url3, TestClass.serializer())
        }
    }
}

@Serializable
data class TestClass(
    val x: String,
    val y: Int,
    val z: Long
)