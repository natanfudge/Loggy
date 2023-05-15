package natanfudge.io

import io.github.natanfudge.logs.Loggy
import io.github.natanfudge.logs.impl.LoggingCredentials
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import java.nio.file.Files
import kotlin.test.Test

class LoggyTest {
    private val loggy = Loggy.create(
        logToConsole = true, logsDir = Files.createTempDirectory("loggy"), credentials = LoggingCredentials(
            username = charArrayOf('u', 's', 'e', 'r'),
            password = charArrayOf('p', 'a', 's', 's')
        )
    )

    @Test
    fun testCoroutine() {
        runBlocking {
            loggy.startSuspend("foo"){
                delay(1)
            }
        }
    }
}