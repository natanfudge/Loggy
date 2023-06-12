import dayjs from "dayjs";
import {SimplePromiseMemoryCache} from "../ui/SimplePromiseMemoryCache";
import utc from 'dayjs/plugin/utc'
import {unixMs} from "../utils/Utils";
import {GetLogsRequest, GetLogsResponse, LoggyApi, parseLogResponse} from "./Api";
import objectSupport from "dayjs/plugin/objectSupport";
import {Day} from "../core/Day";
import {Analytics, DayBreakdown} from "../ui/AnalyticsGraph";
import {PromiseMemoryCache} from "fudge-lib/dist/collections/PromiseMemoryCache"
import {recordToArray} from "fudge-lib/dist/methods/Javascript";
import {LogsQuery} from "../ui/Endpoint";

dayjs.extend(utc)
dayjs.extend(objectSupport);


export const DEBUG_ENDPOINT = "debug"

export const debugEndpoints = [DEBUG_ENDPOINT, "very long thing of hell"]

export namespace LoggingServer {

    export async function getEndpoints(): Promise<string[]> {
        const value = endpointCache.get(() => LoggyApi.getEndpoints())
        return value
    }

    const endpointCache = new SimplePromiseMemoryCache<string[]>()


    export async function getLogs(query: GetLogsRequest): Promise<GetLogsResponse> {
        if (debugEndpoints.includes(query.endpoint ?? "")) return parseLogResponse(testLogResponse)
        else {
            console.log(`Getting logs with key ${encodeAsKey(query)} and query`, query)
            return logsCache.get(encodeAsKey(query.query, query.endpoint, query.page), () => LoggyApi.getLogs(query))
        }
        // const startDate = startDay.start()
        // const endDate = endDay.end()
        // return endpoint === DEBUG_ENDPOINT ? parseLogResponse(testLogResponse) :
        //     logsCache.get(
        //         encodeAsKey(endpoint, unixMs(startDate), unixMs(endDate), page, filter.error, filter.warn, filter.info),
        //         () => LoggyApi.getLogs({endpoint, startDate, endDate, page, allowError: filter.error, allowInfo: filter.info, allowWarn: filter.warn})
        //     )
    }


    // 23, 59, 59, 999_999_999

    export function refreshLog() {
        logsCache.dumpAll()
    }

    const logsCache = new PromiseMemoryCache<GetLogsResponse>()

    export async function getAnalytics(endpoint: string, startDay: Day, endDay: Day): Promise<Analytics> {
        const startDate = startDay.start()
        const endDate = endDay.end()
        return analyticsCache.get(encodeAsKey(endpoint, unixMs(startDate), unixMs(endDate)),
            async () => {
                const response = await LoggyApi.getAnalytics({endpoint, startDate, endDate})
                return recordToArray(response, (unixMs: string, breakdown: DayBreakdown) => [Day.ofUnixMs(parseInt(unixMs)), breakdown]);
            })
    }

    function encodeAsKey(...stuff: unknown[]): string {
        return stuff.join()
    }

    const analyticsCache = new PromiseMemoryCache<Analytics>()

}


// language=JSON
const testLogResponse = `{
  "pageCount": 1,
  "logs": [
    {
      "name": "amar",
      "startTime": 1683974074000,
      "endTime": 1683975084000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683975074000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683975074000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683975074000,
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
      "startTime": 1683975074000,
      "endTime": 1683975074000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683975074000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683975074000,
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
      "startTime": 1683974133000,
      "endTime": 1683974133000,
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
          "time": 1683974133000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683974133000,
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
      "startTime": 1683973690000,
      "endTime": 1683973690000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973690000,
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
      "startTime": 1683973662000,
      "endTime": 1683973662000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973662000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683973662000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683996662000,
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
      "startTime": 1683973662000,
      "endTime": 1683973662000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973662000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683973662000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683996662000,
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