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
From today to today.
#### Syntax
`from:<time>`  
`to:<time>`
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
#### Default
Show all severities
#### Syntax
`level:<severity>`  
`levelExact:<severity>`
#### Examples
`level:info`  
`levelExact:warn`  
`leve:error`

### Filter by key/value
Only shows calls that have logged a data key with a certain data value.
#### Default
Show all.
#### Syntax
`<key>:<value>`
#### Examples
`id:200`  
`fileName:dog.jpg`

### Logical operators
Logical operator may be used to AND/OR/NOT filters. (Although AND is the default for space-seperated filters). Parentheses may be used to disambiguate. Logical operators are not relevant for time range filtering.
#### Syntax
`<filter> OR <filter>`  
`<filter> AND <filter>`   
`(<filters>) OR (<filters>)`  
`(<filters>) AND (<filters>)`  
`NOT <filter>`
`NOT (<filter> OR <filter>)`
#### Examples
`id:200 or level:info`  
`fileName:dog.jpg and not (levelExact:warn or levelExact:error)`


### Literal notation
Quotes `""` may be used to treat strings literally.   
Escape quotes with `\ ` to search for quotes literally.  
Technically searching for `\"` is impossible because you can't escape escapes, but you can just do `\` without quotes to search for backslashes. 
#### Syntax
`"<string>"`
#### Examples:
`"You can have spaces"`  
`"(You can start with a parentheses and treat it literally"`  
`"Here's \" how you can search for a quote"`  
`"You can even do":"key values"`