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
   
## Filter API
Loggy employs a search bar that allows filtering results. The results will be filtered by every query part, seperated by a space. For example:  
```id:200 levelExact:info```   
will only show results that have `id` equal to `200` AND have a log level of exactly `info`.  
Everything is case-insensitive.
### Filter start/end time
Only shows calls that happened later than a day (when using `from:`) or earlier than a day (when using `to:`), inclusive. Only a day may be specified (and not an hour). Specifying year and month is optional.
#### Default
Today 
#### Syntax
`from:<day>/<month>/<year>`  
`to:<day>/<month>/<year>`
#### Examples
`from:20/12/2001`  
`to:20/12`  
`from:20`  
`to:today`  
`from:yesterday`  
`to:lastweek`  
`from:lastmonth`  

### Filter by severity
Only shows calls that have at least the severity specified (when using `level:`) or exactly the severity specified (when using `levelExact:`)