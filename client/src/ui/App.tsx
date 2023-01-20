import React from 'react'
import '../App.css'
import {DetailLog, isDetailLog, isMessageLog, LogEvent, LogLine, MessageLog, parseLogEvents} from "../core/Logs";
import {Column, recordToArray, Row, StringMap} from "./Utils";
import {Dayjs} from "dayjs";
import {createTheme, CssBaseline, Divider, ThemeProvider, Typography} from "@mui/material";
import {ArrowDownward} from "@mui/icons-material";
import "../extensions/ExtensionsImpl"
import styled from "@emotion/styled";

export function AppWrapper() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return <Typography>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    </Typography>
}

function App() {
    const logs = parseLogEvents(json)
    const endpoint = logs[0].name
    const day = dayToString(logs[0].startTime)


    return <div>
        <Row style={{padding: 10, paddingLeft: 50}}>
            <Typography style={{textDecoration: "underline"}} variant={"h5"}>
                Logs for {endpoint}<br/>
            </Typography>
            <div style={{flexGrow: 1}}/>
            <Typography variant={"h6"}>
                {day}
            </Typography>
        </Row>


        <LogEventUi log={logs[0]}/>
    </div>


}

function LogEventUi({log}: { log: LogEvent }) {
    return <Row style={{padding: 30, paddingTop: 0}}>

        {/*Start: {}<br/>*/}
        {/*End: {dateToString(log.endTime)}<br/>*/}
        <LogLinesUi logs={log.logs}/>

        <Divider orientation={"vertical"} flexItem style = {{paddingLeft: 10, marginRight: 10}}/>
        <Typography variant={"h6"} style = {{alignSelf: "center"}}>
            <Row >
                <Column >
                <span>
                    {timeToString(log.startTime)}
                </span>
                    <ArrowDownward style = {{alignSelf: "center"}}/>
                    <span>
                    {timeToString(log.endTime)}
                </span>
                </Column>
                <Typography style = {{alignSelf: "center", paddingLeft: 4}}>
                    ({log.endTime.millisecond() - log.startTime.millisecond()}ms total)
                </Typography>
            </Row>

        </Typography>
    </Row>
}

const TableRow = styled.td`
border-bottom: 1px solid #6d6c6c;
`

function KeyValueTable({details}: { details: StringMap }) {
    return <Column style = {{marginTop: 5}}>
        <Divider style = {{backgroundColor: "#6d6c6c"}}/>
        <table>
            {recordToArray(details, (name, detail, index) => {
                // Mods are displayed separately
                // if (name !== "Mod List" && name !== "Fabric Mods") {
                    return <tr style = {{borderBottom: "1px dashed red"}}>
                        <TableRow style = {{fontWeight: "bold", padding: 5, width: "30%"}}>{name}</TableRow>
                        <TableRow style={{lineBreak: "anywhere", paddingLeft: 10, paddingRight: 10, paddingTop:5, paddingBottom: 5}}>{String(detail)}</TableRow>
                    </tr>

                // <Column key={index}>
                //         <Row key={name}>
                //             <span style = {{fontWeight: "bold", padding: 5, width: "30%"}}>
                //                 {name}
                //             </span>
                //             <Divider style = {{backgroundColor: primaryColor, height: "auto", width: 1}}/>
                //             <span style={{lineBreak: "anywhere", paddingLeft: 10, paddingRight: 10, paddingTop:5, paddingBottom: 5}}>
                //                 {String(detail)}
                //             </span>
                //         </Row>
                //         <Divider style = {{backgroundColor:index % 2 === 1 ? "#6d6c6c" : undefined }}/>
                //     </Column>
                })}
        {/*//     <tr>*/}
        {/*//         <td style = {{border: "1px solid #dddddd", textAlign: "left", padding: "8px"}}>Alfreds Futterkiste</td>*/}
        {/*//         <td>Maria Anders</td>*/}
        {/*//         <td>Germany</td>*/}
        {/*//     </tr>*/}
        {/*//     <tr>*/}
        {/*//         <td>Centro comercial Moctezuma</td>*/}
        {/*//         <td>Francisco Chang</td>*/}
        {/*//         <td>Mexico</td>*/}
        {/*//     </tr>*/}
        </table>




    </Column>
}


function LogLinesUi({logs}: { logs: LogLine[] }) {
    const details = logs.filter(l => isDetailLog(l)) as DetailLog[]
    const messages = logs.filter(l => isMessageLog(l)) as MessageLog[]

    return <Column style = {{width: "50%"}}>
        <KeyValueTable details={details.toRecord(l => [l.key,l.value])}/>
        {/*<Column>*/}
        {/*    {details.map(d => <DetailLogUi detail={d}/>)}*/}
        {/*</Column>*/}
        <Column>
            {messages.map(m => <MessageLogUi message={m}/>)}
        </Column>
    </Column>
}

function DetailLogUi({detail}: { detail: DetailLog }) {
    return <span>
        {detail.key}: {detail.value}
    </span>
}

function MessageLogUi({message}: { message: MessageLog }) {
    return <Row>
        <Typography variant={"subtitle"}>
            {dayToString(message.time)}
        </Typography>
         {message.severity}: {message.message}
    </Row>
}

function dateToString(date: Dayjs): string {
    return `${dayToString(date)} ${timeToString(date)}`
}

function dayToString(date: Dayjs): string {
    return `${twoChars(date.day())}/${twoChars(date.month() + 1)}/${twoChars(date.year())}`
}

function timeToString(date: Dayjs): string {
    return `${twoChars(date.hour())}:${twoChars(date.minute())}:${threeChars(date.millisecond())}`
}

function twoChars(number: number): string {
    const str = String(number)
    if (str.length == 1) return `0${str}`
    else return str.substring(str.length - 2, str.length)
}
function threeChars(number: number): string {
    const str = String(number)
    if (str.length == 1) return `00${str}`
    if (str.length == 2) return `0${str}`
    else return str
}
export const primaryColor = "#90caf9"

export default App
const json = `[{
    "name": "scheduleTasks",
    "startTime": 1674225696143,
    "endTime": 1674225696146,
    "logs": [
        {
            "type": "DetailLog",
            "key": "Schedule Time",
            "value": "2023-01-20T14:41:36.143300500Z"
        },
        {
            "type": "DetailLog",
            "key": "Foo",
            "value": "Bar"
        },
        {
            "type": "MessageLog",
            "message": "Halo Info",
            "time": 1674225696143,
            "severity": "Info"
        },
        {
            "type": "MessageLog",
            "message": "Halo Warn",
            "time": 1674225696144,
            "severity": "Warn"
        },
        {
            "type": "ErrorLog",
            "message": "Halo Error",
            "time": 1674225696144,
            "exception": {
                "className": "java.lang.NullPointerException",
                "message": "",
                "stacktrace": "java.lang.NullPointerException\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:86)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
            }
        },
        {
            "type": "ErrorLog",
            "message": "Unexpected error handling 'scheduleTasks'",
            "time": 1674225696145,
            "exception": {
                "className": "java.lang.IllegalArgumentException",
                "message": "Fuck jhew",
                "stacktrace": "java.lang.IllegalArgumentException: Fuck jhew\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:87)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
            }
        }
    ]
},{
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