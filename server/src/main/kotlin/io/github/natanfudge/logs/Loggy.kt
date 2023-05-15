package io.github.natanfudge.logs

import io.github.natanfudge.logs.impl.FancyLogger
import io.github.natanfudge.logs.impl.LoggingCredentials
import io.ktor.server.application.*
import io.ktor.server.routing.*
import java.nio.file.Path

public interface Loggy {

    public companion object {
        /**
         * Created once at the top level
         */
        public fun create(
            logToConsole: Boolean,
            logsDir: Path,
            credentials: LoggingCredentials
        ): Loggy {
            return FancyLogger(logToConsole, logsDir, credentials)
        }
    }

    /**
     * Must be installed in the ktor application setup
     */
    context(Application)
    public fun install()

    /**
     * Must be called in the routing of the app to allow viewing logs
     */
    context(Routing)
    public fun route()

    public fun <T> startCall(name: String, call: LogContext.() -> T): T
    public suspend fun <T> startSuspend(name: String, call: suspend LogContext.() -> T): T
    public fun <T> startCallWithContextAsParam(name: String, call: (LogContext) -> T): T
    public suspend fun <T> startSuspendWithContextAsParam(name: String,  call: suspend (LogContext) -> T): T
}