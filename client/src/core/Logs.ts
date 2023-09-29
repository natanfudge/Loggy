import dayjs, {Dayjs} from "dayjs";

//TODO: turn loggy into a service! Need to think about how we split caesarea and the personal service though. An option for self hosting is important.


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
    return isMessageLog(logLine) && logLine.severity === "Error"
}
export function isWarningLog(logLine: LogLine): logLine is ErrorLog {
    return isMessageLog(logLine) && logLine.severity === "Warn"
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

type Exception = ExceptionElement[]

interface ExceptionElement {
    className: string
    message: string
    stacktrace: string
}

export type Severity = "Verbose" | "Debug"| "Info" | "Warn" | "Error"
export const AllSeverities: Severity[] = ["Verbose", "Debug", "Info", "Warn", "Error"]

/**
 * Represents how Verbose < Debug < Info < Warn < Error
 */
export function severityValue(severity: Severity) : number {
    switch (severity) {
        case "Verbose":
            return 0
        case "Debug":
            return 1
        case "Info":
            return 2
        case "Warn":
            return 3
        case "Error":
            return 4
    }
}