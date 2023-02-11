package natanfudge.io

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id

fun main() {
    val boxStore = MyObjectBox.builder()
        .name("log_viewer")
        .build()

    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module, watchPaths = listOf("classes"))
        .start(wait = true)
}

fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello XDD!")
        }
        // Static plugin. Try to access `/static/index.html`
        static("/static") {
            resources("static")
        }
    }
}

@Entity
data class User(
    @Id
    var id: Long = 0,
    var name: String? = null
)

