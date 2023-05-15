@file:OptIn(ExperimentalUnsignedTypes::class)

package natanfudge.io

import io.github.natanfudge.logs.impl.*
import io.github.natanfudge.logs.impl.analytics.*
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.nio.file.Files

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
    fun testWriteRead() {
        val archive = AnalyticsArchive(Files.createTempDirectory("analytics_test"))

        val analytics1: Analytics = mapOf(
            Day(1u, 2u, 1973u) to DayBreakdown(234523123, 41, 45),
            Day(2u, 1u, 1970u) to DayBreakdown(0, 9, 2),
            Day(11u, 9u, 1980u) to DayBreakdown(2343123, 0, 5),
        )

        archive.append("test", analytics1)
        expectThat(archive.getAll("test")).isEqualTo(analytics1)

        archive.append("test", analytics1)
        // Because of the way maps work the new keys would override the old keys
        expectThat(archive.getAll("test")).isEqualTo(analytics1)

        val analytics2 = mapOf(
            Day(1u, 2u, 1973u) to DayBreakdown(234523123, 41, 45),
            Day(5u, 1u, 1970u) to DayBreakdown(0, 9, 2),
            Day(14u, 9u, 1980u) to DayBreakdown(2343123, 0, 5),
        )

        archive.append("test", analytics2)
        expectThat(archive.getAll("test")).isEqualTo(analytics1 + analytics2)
    }
}
