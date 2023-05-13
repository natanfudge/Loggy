package io.github.natanfudge.logs.impl

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
private const val UserSessionName = "log-admin_session"
internal const val AuthSessionName = "log-auth-session"
private const val AuthFormName = "log-auth-form"
private const val AuthUsernameField = "username"
private const val AuthPasswordField = "password"
internal const val LogsPath = "/logs"
internal fun Application.installAuthentication(correctCreds: LoggingCredentials) {
    install(Sessions) {
        cookie<UserSession>(UserSessionName) {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 600000
        }
    }
    install(Authentication) {
        form(AuthFormName) {
            userParamName = AuthUsernameField
            passwordParamName = AuthPasswordField
            validate { credentials ->
                if (credentials.name == String(correctCreds.username) && credentials.password == String(correctCreds.password)) {
                    UserIdPrincipal(credentials.name)
                } else {
                    null
                }
            }
            challenge(LoginPath)
        }

        session<UserSession>(AuthSessionName) {
            validate { session ->
                session
            }
            challenge {
                call.respondRedirect(LoginPath)
            }
        }
    }
}

internal fun Routing.routeAuthentication(){
    get(LoginPath) {
        call.respondBytes(getResourceBytes("/login.html")!!, contentType = ContentType.Text.Html)
    }

    authenticate(AuthFormName) {
        post(LoginPath) {
            val userName = call.principal<UserIdPrincipal>()?.name.toString()
            call.sessions.set(UserSession(name = userName, count = 1))
            call.respondRedirect(LogsPath)
        }
    }
}

internal data class UserSession(val name: String, val count: Int) : Principal
