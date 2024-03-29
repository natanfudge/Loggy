@file:OptIn(ExperimentalUnsignedTypes::class)

package io.github.natanfudge.logs.impl.analytics


import java.nio.file.Path
import kotlin.io.path.appendBytes
import kotlin.io.path.createFile
import kotlin.io.path.exists
import kotlin.io.path.readBytes

public typealias Analytics = Map<Day, DayBreakdown>

private const val InfoBytes = 4
private const val WarningBytes = 2
private const val ErrorBytes = 2
private const val DayBreakdownBytes = InfoBytes + WarningBytes + ErrorBytes
private const val DayBytes = 3
private const val AnalyticsRowBytes = DayBreakdownBytes + DayBytes


private const val CreationYearOfTheUniverse = 1970u

// this is bad and really, really overengineered, but it works well, so it stays
internal class AnalyticsArchive(private val dir: Path) {
     fun append(key: String, analytics: Analytics) {
        val file = dir.withKey(key)
        if (!file.exists()) file.createFile()
        file.appendBytes(encode(analytics).toByteArray())
    }

    fun getAll(key: String): Analytics {
        val path = dir.withKey(key)
        if (!path.exists()) return mapOf()
        return decode(path.readBytes().toUByteArray())
    }

    private fun Path.withKey(key: String) = resolve("$key.kv")

    /**
     * It's stored forever so I make sure to make it extra compact
     */
    private fun encode(analytics: Analytics): UByteArray {
        val bytes = UByteArray(analytics.size * AnalyticsRowBytes)
        var shift = 0
        for ((day, breakdown) in analytics) {
            shift += bytes.putDay(index = shift, day)
            shift += bytes.putUInt(index = shift, num = breakdown.infoCount)
            shift += bytes.putUShort(index = shift, num = breakdown.warningCount)
            shift += bytes.putUShort(index = shift, num = breakdown.errorCount)
        }
        return bytes
    }

    private fun decode(bytes: UByteArray): Analytics {
        val analytics: MutableMap<Day, DayBreakdown> = mutableMapOf()
        var shift = 0
        while (shift < bytes.size) {
            val day = bytes.getDay(index = shift)
            shift += DayBytes
            val info = bytes.getUInt(index = shift)
            shift += InfoBytes
            val warning = bytes.getUShort(index = shift)
            shift += WarningBytes
            val error = bytes.getUShort(index = shift)
            shift += ErrorBytes

            analytics[day] = DayBreakdown(infoCount = info, warningCount = warning, errorCount = error)
        }
        return analytics
    }

    private fun UByteArray.putDay(index: Int, day: Day): Int {
        this[index] = day.day
        this[index + 1] = day.month
        this[index + 2] = (day.year - CreationYearOfTheUniverse).toUByte()
        return DayBytes
    }

    private fun UByteArray.getDay(index: Int): Day {
        return Day(
            day = this[index],
            month = this[index + 1],
            year = (this[index + 2] + CreationYearOfTheUniverse).toUShort()
        )
    }


}

public fun UByteArray.getUShort(index: Int): UShort {
    val leastSignificant = this[index]
    val mostSignificant = this[index + 1]
    return ((mostSignificant.toUInt() shl 8) + leastSignificant).toUShort()
}

public fun UByteArray.putUShort(index: Int, num: UShort): Int {
    this[index] = (num.toUInt()).bitRange(start = 0, length = 8)
    this[index + 1] = (num.toUInt()).bitRange(start = 8, length = 8)
    return 2
}

public fun UByteArray.getUInt(index: Int): UInt {
    return this[index].toUInt() + (this[index + 1].toUInt() shl 8) + (this[index + 2].toUInt() shl 16) + (this[index + 3].toUInt() shl 24)
}

public fun UByteArray.putUInt(index: Int, num: UInt): Int {
    this[index] = num.bitRange(start = 0, length = 8)
    this[index + 1] = num.bitRange(start = 8, length = 8)
    this[index + 2] = num.bitRange(start = 16, length = 8)
    this[index + 3] = num.bitRange(start = 24, length = 8)
    return 4
}

// Considers the least important bits as first
private fun UInt.bitRange(start: Int, length: Int): UByte {
    check(length <= 8)
    // Removes bits to the left
    val shifted = this shr start
    val keep = (1 shl (length)) - 1 // This maps to 0b1 for length = 1, 0b11 for length = 2, etc.
    // Removes bits to the right
    return (shifted and keep.toUInt()).toUByte()
}

