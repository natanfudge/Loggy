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

