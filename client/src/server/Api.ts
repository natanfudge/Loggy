import {LogResponse} from "./LoggingServer";
import dayjs, {Dayjs} from "dayjs";
import {unixMs} from "../utils/Utils";

export namespace LoggyApi {
    const origin = window.location.origin.startsWith("http://localhost")
    || window.location.origin.startsWith("http://127.0.0.1") ? "http://localhost:80" : window.location.origin;

    export async function getEndpoints(): Promise<string[]> {
        const response = await fetch(`${origin}/__log_viewer__/endpoints`)
        const text = await response.text()
        return JSON.parse(text)
    }

    export async function getLogs(endpoint: string, startDate: Dayjs, endDate: Dayjs, page: number): Promise<LogResponse> {
        const args = `?endpoint=${endpoint}&start=${unixMs(startDate)}&end=${unixMs(endDate)}&page=${page}`
        const response = await fetch(`${origin}/__log_viewer__/logs${args}`)
        const text = await response.text()
        return parseLogResponse(text)
    }
}

export function parseLogResponse(json: string): LogResponse {
    return JSON.parse(json, (k, v) => {
        if (typeof v === "number" && k.toLowerCase().endsWith("time")) {
            return dayjs(v)
        } else {
            return v
        }
    })
}
