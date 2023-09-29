package test

import io.github.natanfudge.logs.Loggy
import io.github.natanfudge.logs.impl.LoggingCredentials
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.nio.charset.Charset
import java.nio.file.Paths

object TestApp

fun main() {
    embeddedServer(
        Netty,
        port = 80,
        host = "0.0.0.0",
        module = Application::module,
        watchPaths = listOf("classes", "resources")
    )
        .start(wait = true)
}

private fun getResource(path: String): CharArray =
    TestApp::class.java.getResourceAsStream(path)!!.readBytes().toString(Charset.defaultCharset()).toCharArray()

val logger = Loggy.create(
    logToConsole = true,
    credentials = LoggingCredentials(
        username = getResource("/secrets/admin_user.txt"),
        password = getResource("/secrets/admin_pass.txt")
    ),
    logsDir = Paths.get(System.getProperty("user.home"), ".log_viewer_test")
)

private fun Application.module() {
    logger.install()
    logger.startCall("amar") {
        logInfo { "Info Test" }
        logWarn { "Warn Test" }
        logError(NullPointerException()) { "Error Test" }

        logData("Foo") { "Bar" }
        logData("Biz") { "Baz" }
    }
    logger.startCall("amar") {
        logInfo { "Foo" }
    }
    logger.startCall("amar") {
        logInfo { "Bar" }
    }

    logger.startCall("verb") {
        logVerbose { "Halo halo" }
    }

    logger.startCall("deb") {
        logDebug { "Halo halo deb" }
    }

    routing {
        logger.route()
        get("test") {
            logger.startCall("testRequest1") {
                logData("Amar") { "XD" }
                throw NullPointerException()
            }
            call.respondText("Test")
        }

        get("test2") {
            logger.startCall("testRequest2") {
                logInfo { "Test Test" }
                logWarn { "Warn Test Test" }
            }
            call.respondText("Test2")
        }
        get("/") {
            call.respondRedirect("/logs")
        }
    }
}
