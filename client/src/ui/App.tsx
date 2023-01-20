import React, {Fragment} from 'react'
import '../App.css'
import {DetailLog, isDetailLog, isMessageLog, LogEvent, LogLine, MessageLog, parseLogEvents} from "../core/Logs";
import {Column} from "./Utils";
import {Dayjs} from "dayjs";
import {Typography} from "@mui/material";

function App() {
    const logs = parseLogEvents(json)



    return <Typography>
        <LogEventUi log={logs[0]}/>
    </Typography>
}

function LogEventUi({log}: { log: LogEvent }) {
    return <div>
            Name: {log.name}<br/>
            Start: {dateToString(log.startTime)}<br/>
            End: {dateToString(log.endTime)}<br/>
        <LogLinesUi logs={log.logs}/>
    </div>
}

function LogLinesUi({logs}: { logs: LogLine[] }) {
    const details = logs.filter(l => isDetailLog(l)) as DetailLog[]
    const messages = logs.filter(l => isMessageLog(l)) as MessageLog[]

    return <Column>
        <Column>
            {details.map(d => <DetailLogUi detail={d}/>)}
        </Column>
        <Column>
            {messages.map(m => <MessageLogUi message={m}/>)}
        </Column>
    </Column>
}

function DetailLogUi({detail}: { detail: DetailLog }) {
    return <Fragment>
        {detail.key}: {detail.value}
    </Fragment>
}

function MessageLogUi({message}: { message: MessageLog }) {
    return <Fragment>
        [{dateToString(message.time)}] {message.severity}: {message.message}
    </Fragment>
}

function dateToString(date: Dayjs): string {
    return `${twoChars(date.day())}/${twoChars(date.month())}/${twoChars(date.year())}
     ${twoChars(date.hour())}:${twoChars(date.minute())}:${twoChars(date.millisecond())}`
}

function twoChars(number: number): string {
    const str = String(number)
    if (str.length == 1) return `0${str}`
    else return str.substring(str.length - 2, str.length)
}

export default App
const json = `[{
    "name": "scheduleTasks",
    "startTime": 1674209722013,
    "endTime": 1674209722018,
    "logs": [
        {
            "type": "DetailLog",
            "key": "Schedule Time",
            "value": "2023-01-20T10:15:22.013751300Z"
        },
        {
            "type": "MessageLog",
            "message": "Evicting crashes from days: []",
            "time": 1674209722016,
            "severity": "Info"
        }
    ]
}]
`