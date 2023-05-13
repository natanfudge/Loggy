@file:OptIn(ExperimentalUnsignedTypes::class)

package natanfudge.io

import io.github.natanfudge.logs.impl.*
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.nio.file.Paths

class AnalyticsTest {
    @Test
    fun testShortToByteArray() {
        val array = UByteArray(30)
        val num1 = 2345.toUShort()
        val num2 = 345.toUShort()
        val num3 = 5.toUShort()
        array.putUShort(0, num1)
        array.putUShort(2, num2)
        array.putUShort(5, num3)

        expectThat(array.getUShort(0)).isEqualTo(num1)
        expectThat(array.getUShort(2)).isEqualTo(num2)
        expectThat(array.getUShort(5)).isEqualTo(num3)
    }

    @Test
    fun bar() {
        val orig = ubyteArrayOf(254u)
        expectThat(orig.toByteArray().toUByteArray()[0]).isEqualTo(orig[0])
    }

    @Test
    fun foo() {
        (-1).toUInt()
    }

    @Test
    fun testEncodeDecode() {
        val archive = AnalyticsArchive(Paths.get(""))

        val analytics: Analytics = mapOf(
            Day(1u, 2u, 1973u) to DayBreakdown(234523123, 41, 45),
            Day(2u, 1u, 1970u) to DayBreakdown(0, 9, 2),
            Day(11u, 9u, 1980u) to DayBreakdown(2343123, 0, 5),
        )

        expectThat(archive.decode(archive.encode(analytics))).isEqualTo(analytics)
    }
}
