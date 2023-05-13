import {LogEvent} from "../core/Logs";
import dayjs, {Dayjs} from "dayjs";
import {SimplePromiseMemoryCache} from "../ui/SimplePromiseMemoryCache";
import {PromiseMemoryCache} from "../ui/PromiseMemoryCache";
import utc from 'dayjs/plugin/utc'
import {unixMs} from "../utils/Utils";
import {LoggyApi, parseLogResponse} from "./Api";
import objectSupport from "dayjs/plugin/objectSupport";

dayjs.extend(utc)
dayjs.extend(objectSupport);


export const DEBUG_ENDPOINT = "debug"

export namespace LoggingServer {

    export async function getEndpoints(): Promise<string[]> {
        const value = endpointCache.get(() => LoggyApi.getEndpoints())
        return value
    }

    const endpointCache = new SimplePromiseMemoryCache<string[]>()


    export async function getLogs(endpoint: string, startDay: Day, endDay: Day, page: number): Promise<LogResponse> {
        const startDate = startOfDay(startDay)
        const endDate = endOfDay(endDay)
        return endpoint === DEBUG_ENDPOINT ? parseLogResponse(testLogResponse) :
            logsCache.get(
                `${endpoint}${unixMs(startDate)}${unixMs(endDate)}${page}`,
                () => LoggyApi.getLogs(endpoint, startDate, endDate, page)
            )
    }

    function startOfDay(day: Day): Dayjs {
        return dayjs({year: day.year, month: day.month, day: day.day})
    }

    function endOfDay(day: Day): Dayjs {
        return dayjs({
            year: day.year,
            month: day.month,
            day: day.day,
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 999
        })
    }

    // 23, 59, 59, 999_999_999

    export function refreshLog() {
        logsCache.dumpAll()
    }

    const logsCache = new PromiseMemoryCache<LogResponse>()

}


export function stringifyLogResponse(log: LogResponse): string {
    return JSON.stringify(log, (k, v) => {
        // console.log(`k: ${k}, v: ${v}, v is dayjs: ${isDayJs(v)}, type of v: ${typeof v}`)
        if (typeof v === "string" && k.toLowerCase().endsWith("time")) {
            return unixMs(dayjs(v));
        } else {
            return v
        }
    })
}


export interface LogResponse {
    pageCount: number,
    logs: LogEvent[]
}

export function dayJsToDay(dayjs: Dayjs): Day {
    const utc = dayjs.utc()
    return {
        day: utc.date(),
        month: utc.month() + 1,
        year: utc.year()
    }
}

export interface Day {
    // 1-indexed
    day: number,
    // 1-indexed
    month: number
    year: number
}

// language=JSON
const testLogResponse = `{
  "pageCount": 1,
  "logs": [
    {
      "name": "amar",
      "startTime": 1683974074,
      "endTime": 1683975084,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683975074,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683975074,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683975074,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683975074,
      "endTime": 1683975074,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683975074,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683975074,
          "severity": "Warn"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683974133,
      "endTime": 1683974133,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683974133,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683974133,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683974133,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683973690,
      "endTime": 1683973690,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973690,
          "severity": "Info"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683973662,
      "endTime": 1683973662,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973662,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683973662,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683996662,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    }
  ]
}`