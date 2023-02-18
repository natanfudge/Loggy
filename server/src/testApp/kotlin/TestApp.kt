import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import natanfudge.io.logs.FancyLogger
import java.nio.file.Paths

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

private fun Application.module() {
    val logger = FancyLogger(
        logToConsole = true, logsDir = Paths.get(System.getProperty("user.home"), ".log_viewer_test")
    )
    logger.startCall("amar") {
        logInfo { "Info Test" }
        logWarn { "Warn Test" }
        logError(NullPointerException()) { "Error Test" }

        logData("Foo") { "Bar" }
        logData("Biz") { "Baz" }
    }
    routing {
        logger.route()
        get("test"){
            logger.startCall("testRequest1") {
                logData("Amar"){"XD"}
                throw NullPointerException()
            }
            call.respondText("Test")
        }

        get("test2"){
            logger.startCall("testRequest2"){
                logInfo { "Test Test" }
                logWarn { "Warn Test Test" }
            }
            call.respondText("Test2")
        }
        // Static plugin. Try to access `/static/index.html`
        static("/logs") {
            staticBasePackage = "__log_viewer__/static"
            resources(".")
            defaultResource("index.html")
        }
    }
}

