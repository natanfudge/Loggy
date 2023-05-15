package io.github.natanfudge.logs.impl.analytics

import kotlinx.serialization.Serializable

@Serializable
public data class DayBreakdown(
    val infoCount: UInt,
    val warningCount: UShort,
    val errorCount: UShort
) {
    constructor(infoCount: Int, warningCount: Int, errorCount: Int) :
            this(
                infoCount = infoCount.toUInt(),
                warningCount = warningCount.toUShort(),
                errorCount = errorCount.toUShort()
            ) {
        check(infoCount >= 0)
        check(warningCount >= 0)
        check(errorCount >= 0)
        check(warningCount.toUShort() <= UShort.MAX_VALUE)
        check(errorCount.toUShort() <= UShort.MAX_VALUE)
    }
}

