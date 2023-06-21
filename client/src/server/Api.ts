import dayjs, {Dayjs} from "dayjs";
import {isDayJs, unixMs} from "../utils/Utils";
import {DayBreakdown} from "../ui/AnalyticsGraph";
import {LogEvent} from "../core/Logs";
import {recordToArray} from "fudge-lib/dist/methods/Javascript";
import {EndpointQuery} from "../ui/Endpoint";

export namespace LoggyApi {
    const origin = window.location.origin.startsWith("http://localhost")
    || window.location.origin.startsWith("http://127.0.0.1") ? "http://localhost:80" : window.location.origin;

    export async function getEndpoints(): Promise<GetEndpointsResponse> {
        const endpoints = await makeRequest("endpoints", undefined)
        return JSON.parse(endpoints)
    }

    export async function getLogs(request: GetLogsRequest): Promise<GetLogsResponse> {
        const logs = await makeRequest("logs", request)
        const parsed = parseLogResponse(logs)
        // if (isLogsResponseSuccess(parsed)) {
        //     console.log(`Time of first log is ${parsed.logs[0].startTime}`)
        // }
        return parsed
    }

    export async function getAnalytics(request: GetAnalyticsRequest): Promise<GetAnalyticsResponse> {
        const analytics = request.endpoint === "debug" ? testAnalyticsResponse : await makeRequest("analytics", request)
        return JSON.parse(analytics)
    }

    async function makeRequest(endpoint: string, request: object | undefined): Promise<string> {
        const response = (await fetch(`${origin}/__log_viewer__/${endpoint}${encodeObjectToUrl(request)}`))
        if (response.ok) {
            return response.text()
        } else {
            throw new Error(`Error making request: ${await response.text()}, code: ${response.status}`)
        }
    }


}

const testAnalyticsResponse = `{
    "1684108800000": {
        "infoCount": 4,
        "warningCount": 0,
        "errorCount": 0
    },
    "1684454400000": {
        "infoCount": 1,
        "warningCount": 0,
        "errorCount": 0
    }
}`


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

export type GetLogsRequest = EndpointQuery & {
    page: number
}
// export interface GetLogsRequest {
//     endpoint: string
//     startDate: Dayjs
//     endDate: Dayjs
//     page: number,
//     allowInfo: boolean,
//     allowWarn: boolean,
//     allowError: boolean
// }

// Map from day (unix timestamp) to breakdown
export type GetAnalyticsResponse = Record<string, DayBreakdown>

export function isLogsResponseSuccess(response: GetLogsResponse | undefined): response is GetLogsResponseSuccess {
    return response !== undefined && "logs" in response
}

export type GetLogsResponse = GetLogsResponseSuccess | GetLogsResponseSyntaxError

export interface GetLogsResponseSyntaxError {
    error: string
}

export interface GetLogsResponseSuccess {
    pageCount: number,
    logs: LogEvent[]
}

export type GetEndpointsResponse = string[]


export function parseLogResponse(json: string): GetLogsResponse {
    if (json === undefined) throw new Error(`Unexpected undefined json ${json}`)
    return JSON.parse(json, (k, v) => {
        if (typeof v === "number" && k.toLowerCase().endsWith("time")) {
            return dayjs(v)
        } else {
            return v
        }
    })
}
