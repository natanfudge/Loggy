import dayjs, {Dayjs} from "dayjs";
import {isDayJs, unixMs} from "../utils/Utils";
import {Analytics, DayBreakdown} from "../ui/AnalyticsGraph";
import {Day} from "../core/Day";
import {LogEvent} from "../core/Logs";
import {recordToArray} from "fudge-lib/dist/methods/Javascript";

export namespace LoggyApi {
    const origin = window.location.origin.startsWith("http://localhost")
    || window.location.origin.startsWith("http://127.0.0.1") ? "http://localhost:80" : window.location.origin;

    export async function getEndpoints(): Promise<GetEndpointsResponse> {
        const endpoints = await makeRequest("endpoints", undefined)
        return JSON.parse(endpoints)
    }

    export async function getLogs(request: GetLogsRequest): Promise<GetLogsResponse> {
        const logs = await makeRequest("logs", request)
        return parseLogResponse(logs)
    }

    export async function getAnalytics(request: GetAnalyticsRequest): Promise<GetAnalyticsResponse> {
        const analytics = await makeRequest("analytics", request)
        return JSON.parse(analytics)
    }

    async function makeRequest(endpoint: string, request: object | undefined): Promise<string> {
        return (await fetch(`${origin}/__log_viewer__/${endpoint}${encodeObjectToUrl(request)}`)).text()
    }


}

function encodeObjectToUrl(obj: object | undefined): string {
    if (obj === undefined) return ""
    return "?" + recordToArray(obj, (k, v) => {
        const value = isDayJs(v) ? unixMs(v) : v;
        return `${k}=${value}`;
    }).join("&")
}

export interface GetAnalyticsRequest {
    endpoint: string
    startDate: Dayjs
    endDate: Dayjs
}

export interface GetLogsRequest {
    endpoint: string
    startDate: Dayjs
    endDate: Dayjs
    page: number
}

// Map from day (unix timestamp) to breakdown
export type GetAnalyticsResponse = Record<string, DayBreakdown>

export interface GetLogsResponse {
    pageCount: number,
    logs: LogEvent[]
}

export type GetEndpointsResponse = string[]

const testAnalytics: Analytics = [
    [new Day({day: 1, month: 1, year: 2000}), {infoCount: 10, errorCount: 5, warningCount: 3}],
    [new Day({day: 3, month: 1, year: 2000}), {infoCount: 16, errorCount: 0, warningCount: 0}],
]

export function parseLogResponse(json: string): GetLogsResponse {
    return JSON.parse(json, (k, v) => {
        if (typeof v === "number" && k.toLowerCase().endsWith("time")) {
            return dayjs(v)
        } else {
            return v
        }
    })
}
