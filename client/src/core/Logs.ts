import dayjs, {Dayjs} from "dayjs";


export function parseLogEvents(json: string): LogEvent[] {
    return JSON.parse(json, (k, v) => {
        if (typeof v === "number" && k.toLowerCase().endsWith("time")) {
            return dayjs(v)
        } else {
            return v
        }
    })
}

export interface LogEvent {
    name: string
    startTime: Dayjs
    endTime: Dayjs
    logs: LogLine[]
}

export type LogLine = MessageLog | DetailLog | ErrorLog

export function isMessageLog(logLine: LogLine): logLine is MessageLog {
    return "message" in logLine
}

export function isErrorLog(logLine: LogLine): logLine is ErrorLog {
    return isMessageLog(logLine) && logLine.severity != "Error"
}

export function isDetailLog(logLine: LogLine): logLine is DetailLog {
    return "key" in logLine
}


export interface MessageLog {
    message: string
    time: Dayjs
    severity: Severity
}

export interface DetailLog {
    key: string
    value: string
}

export interface ErrorLog extends MessageLog {
    severity: "Error"
    exception: Exception
}

interface Exception {
    className: string
    message: string
    stacktrace: string
}

type Severity = "Info" | "Warn" | "Error"