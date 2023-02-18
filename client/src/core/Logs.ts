import dayjs, {Dayjs} from "dayjs";



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
    return isMessageLog(logLine) && logLine.severity == "Error"
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

type Severity = "Info" | "Warn" | "Error"