import dayjs, {Dayjs} from "dayjs";



function parseLogEvents(json: string): LogEvent[] {
    return JSON.parse(json, (k, v) => {
        if(typeof v === "number" && k.toLowerCase().endsWith("time")){
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

type LogLine = MessageLog | DetailLog | ErrorLog


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
}

type Severity = "Info" | "Warn" | "Error"