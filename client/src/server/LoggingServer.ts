import {LogEvent} from "../core/Logs";
import dayjs, {Dayjs} from "dayjs";
import {SimplePromiseMemoryCache} from "../ui/SimplePromiseMemoryCache";
import {PromiseMemoryCache} from "../ui/PromiseMemoryCache";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export namespace LoggingServer {
    const origin = window.location.origin.startsWith("http://localhost")
    || window.location.origin.startsWith("http://127.0.0.1") ? "http://localhost:80" : window.location.origin;


    async function fetchEndpoints(): Promise<string[]> {
        const response = await fetch(`${origin}/__log_viewer__/endpoints`)
        const text = await response.text()
        return JSON.parse(text)
    }

    export async function getEndpoints(): Promise<string[]> {
        const value = endpointCache.get(() => fetchEndpoints())
        return value
    }

    const endpointCache = new SimplePromiseMemoryCache<string[]>()

    // export const PageSize = 18;

    export async function getLogs(endpoint: string, day: Day, page: number): Promise<LogResponse> {
        return logsCache.get(`${endpoint}${JSON.stringify(day)}${page}`, () => getLogsImpl(endpoint, day, page))
    }

    export function refreshLog() {
        logsCache.dumpAll()
    }

    const logsCache = new PromiseMemoryCache<LogResponse>()

    async function getLogsImpl(endpoint: string, day: Day, page: number): Promise<LogResponse> {
        const args = `?endpoint=${endpoint}&day=${JSON.stringify(day)}&page=${page}`
        const response = await fetch(`${origin}/__log_viewer__/logs${args}`)
        const text = await response.text()
        return parseLogResponse(text)
    }

    // function getLogsImpl(endpoint: string, day: Day, page: number): LogResponse {
    //     const string = getLogsTestData(endpoint, day)
    //     const parsed = parseLogEvents(string)
    //     const pages = Math.ceil(parsed.length / PageSize)
    //     const filtered: LogResponse = {
    //         pageCount: pages,
    //         // Get only events in the relevant page, 20 items per page
    //         logs: parsed.filter((_, i) => i >= page * PageSize && i < ((page + 1) * PageSize))
    //     }
    //     return filtered
    // }

    // function getLogsTestData(endpoint: string, day: Day): string {
    //     switch (endpoint) {
    //         case "getCrash" :
    //             if (day.day === 17) return getCrash2
    //             else return getCrash1
    //         case "uploadCrash" :
    //             return uploadCrash
    //         case  "scheduleTasks" :
    //             return scheduleTasks
    //         default:
    //             return uploadCrash
    //     }
    // }
}

function parseLogResponse(json: string): LogResponse {
    return JSON.parse(json, (k, v) => {
        if (typeof v === "number" && k.toLowerCase().endsWith("time")) {
            return dayjs(v)
        } else {
            return v
        }
    })
}

// function parseLogEvents(json: string): LogEvent[] {
//     return JSON.parse(json, (k, v) => {
//         if (typeof v === "number" && k.toLowerCase().endsWith("time")) {
//             return dayjs(v)
//         } else {
//             return v
//         }
//     })
// }


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
    day: number,
    month: number
    year: number
}


const scheduleTasks = `[
{"name":"scheduleTasks","startTime":1676558493257,"endTime":1676558494381,"logs":[{"type":"DetailLog","key":"Schedule Time","value":"2023-02-16T14:41:33.257978200Z"},{"type":"MessageLog","message":"Evicting crashes from days: [14/1/2023]","time":1676558493265,"severity":"Info"},{"type":"MessageLog","message":"Evicting 1 crashes from 14/1/2023.","time":1676558493267,"severity":"Info"},{"type":"MessageLog","message":"Archived 933e676e-3c42-45bf-b794-c8de5bdcd054 to S3.","time":1676558494379,"severity":"Info"}]},
{"name":"scheduleTasks","startTime":1676561269499,"endTime":1676561269505,"logs":[{"type":"DetailLog","key":"Schedule Time","value":"2023-02-16T15:27:49.499534500Z"},{"type":"MessageLog","message":"Evicting crashes from days: []","time":1676561269503,"severity":"Info"}]}
]`

const uploadCrash = `[
{"name":"/uploadCrash","startTime":1676558596254,"endTime":1676558596296,"logs":[{"type":"DetailLog","key":"GZip Compressed","value":"true"},{"type":"DetailLog","key":"Accepted size","value":"23869"},{"type":"DetailLog","key":"Generated ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Deletion Key","value":"88Ll89"}]},
{"name":"/uploadCrash","startTime":1676561299873,"endTime":1676561299931,"logs":[{"type":"DetailLog","key":"GZip Compressed","value":"true"},{"type":"DetailLog","key":"Accepted size","value":"23869"},{"type":"DetailLog","key":"Generated ID","value":"c36ff738-63ec-43a4-b28a-7712ebf2f3da"},{"type":"DetailLog","key":"Deletion Key","value":"tZ4rCM"}]}
]`

//TODO: 2 crashes on each, getCrash have a speperate one for each day
const getCrash1 = `[
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676561299944,"endTime":1676561299966,"logs":[{"type":"DetailLog","key":"ID","value":"c36ff738-63ec-43a4-b28a-7712ebf2f3da"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676561299944,"endTime":1676561299966,"logs":[{"type":"DetailLog","key":"ID","value":"c36ff738-63ec-43a4-b28a-7712ebf2f3da"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676561299944,"endTime":1676561299966,"logs":[{"type":"DetailLog","key":"ID","value":"c36ff738-63ec-43a4-b28a-7712ebf2f3da"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]},
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]}

]`

const getCrash2 = `[
{"name":"/{id}/raw.txt","startTime":1676591531854,"endTime":1676591531893,"logs":[{"type":"DetailLog","key":"ID","value":"7ffcd4b7-9d10-4f20-b64e-cf1cf6fc26b2"},{"type":"DetailLog","key":"Response","value":"Success"}]},
{"name":"/{id}","startTime":1676591566322,"endTime":1676591566323,"logs":[{"type":"DetailLog","key":"ID","value":"7ffcd4b7-9d10-4f20-b64e-cf1cf6fc26b2"},{"type":"DetailLog","key":"Title","value":"Ticking block entity"},{"type":"DetailLog","key":"Description","value":"java.lang.NullPointerException: The validated object is null"},{"type":"DetailLog","key":"Code","value":"200 OK"}]}
]`
