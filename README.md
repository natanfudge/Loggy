# Loggy
## Usage
1. Create a `Loggy` instance:
    ```kotlin
    val logger = Loggy.create(
        logToConsole = true,
        credentials = LoggingCredentials(
            username = charArrayOf('u','s','e','r'),
            password = charArrayOf('p', 'a', 's', 's')
        ),
        logsDir = Paths.get("path/to/store/logs")
    )
    ```

2. Install Loggy
    ```kotlin
    fun Application.module() {
        logger.install()
    }
    ```
   
3. Route Loggy
    ```kotlin
    routing {
        logger.route()
    }
    ```
   
4. Log calls
    ```kotlin
    get("foo") {
        logger.startCall("request_name") {
             /** Call logic **/
            logInfo { "Test Test" }
            logWarn { "Warn Test Test" }
   
            /** Call logic **/
            call.respondText("Bar")
        }
    }
    ```