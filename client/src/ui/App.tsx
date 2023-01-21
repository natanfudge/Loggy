import React, {Fragment} from 'react'
import '../App.css'
import {
    DetailLog, ErrorLog,
    isDetailLog,
    isErrorLog,
    isMessageLog,
    LogEvent,
    LogLine,
    MessageLog,
    parseLogEvents
} from "../core/Logs";
import {Column, recordToArray, Row, StringMap} from "./Utils";
import {Dayjs} from "dayjs";
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    createTheme,
    CssBaseline,
    Divider, Paper, Table, TableBody,
    TableCell,
    tableCellClasses, TableContainer,
    TableRow,
    ThemeProvider,
    Typography
} from "@mui/material";
import {ArrowDownward, ExpandMore} from "@mui/icons-material";
import "../extensions/ExtensionsImpl"
import styled from "@emotion/styled";
import {Colors} from "./Colors";
import textColor = Colors.textColor;

export function AppWrapper() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
}

function LogsTitle(endpoint: string, day: string) {
    return <Row style={{padding: 10, paddingLeft: 50}}>
        <Typography style={{textDecoration: "underline"}} variant={"h5"}>
            Logs for {endpoint}<br/>
        </Typography>
        <div style={{flexGrow: 1}}/>
        <Typography variant={"h6"} style={{paddingRight: 20}}>
            {day}
        </Typography>
    </Row>;
}

function App() {
    const logs = parseLogEvents(json)
    const endpoint = logs[0].name
    const day = dayToString(logs[0].startTime)


    return <div>
        {LogsTitle(endpoint, day)}

        <LogEventAccordion log={logs[0]}/>


    </div>

}

function LogEventAccordion({log} : {log: LogEvent}) {
    const errored = log.logs.some(l => isErrorLog(l))
    const erroredSuffix = errored ? " (ERROR)" : ""
    return <Accordion style = {{width: "fit-content"}}>
        <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography style = {{color: errored? "red" : undefined}}>Call at {simpleTimeToString(log.startTime) + erroredSuffix}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <LogEventContent log={log}/>
        </AccordionDetails>
    </Accordion>
}

function LogTimeUi(log: LogEvent) {
    return <>
        <Divider orientation={"vertical"} flexItem style={{paddingLeft: 10, marginRight: 10}}/>
        <Typography variant={"h6"} style={{alignSelf: "center"}}>
            <Row>
                <Column>
                <span>
                    {timeToString(log.startTime)}
                </span>
                    <ArrowDownward style={{alignSelf: "center"}}/>
                    <span>
                    {timeToString(log.endTime)}
                </span>
                </Column>
                <Typography style={{alignSelf: "center", paddingLeft: 4}}>
                    ({log.endTime.millisecond() - log.startTime.millisecond()}ms total)
                </Typography>
            </Row>

        </Typography>
    </>;
}

function LogEventContent({log}: { log: LogEvent }) {
    return <Row style={{padding: 30, paddingTop: 0}}>

        <Column>
            <LogLinesUi logs={log.logs}/>
            <LogErrorUi log={log}/>
        </Column>


        {LogTimeUi(log)}
    </Row>
}

function LogErrorUi({log}: {log: LogEvent}) {
    const errors = log.logs.filter(l => isErrorLog(l)) as ErrorLog[]

    return <Column>

    </Column>
}


function KeyValueTable({details}: { details: StringMap }) {
    return <TableContainer component = {Paper} style = {{height: "fit-content", width: "unset"}}>
        <Table>
            <TableBody>
            {recordToArray(details, (name, detail, index) => {
                const dividerColor = index % 2 == 1 ? Colors.grayDivider : Colors.grayDividerContrast
                const bottomDividerBorder = `1px solid ${dividerColor}`
                const topDividerBorder = index === 0 ? `1px solid ${Colors.grayDivider}` : undefined
                return <StyledTableRow key={name}>
                    <StyledTableCell style = {{borderRight: `1px solid ${primaryColor}`}}>{name}</StyledTableCell>
                    <StyledTableCell >{String(detail)}</StyledTableCell>

                    {/*<tr>*/}
                    {/*    <td style={{*/}
                    {/*        fontWeight: "bold", padding: 7, borderRight: `1px solid ${primaryColor}`,*/}
                    {/*        borderBottom: bottomDividerBorder, borderTop: topDividerBorder,*/}
                    {/*        borderLeft: `1px solid ${Colors.grayDivider}`*/}
                    {/*    }}>{name}</td>*/}
                    {/*    <td style={{*/}
                    {/*        padding: 7,*/}
                    {/*        borderBottom: bottomDividerBorder,*/}
                    {/*        borderTop: topDividerBorder,*/}
                    {/*        borderRight: `1px solid ${Colors.grayDivider}`*/}
                    {/*    }}>{String(detail)}</td>*/}
                    {/*</tr>*/}
                </StyledTableRow>
            })}
            </TableBody>
        </Table>


    </TableContainer>
}

function KeyValueTableOld({details}: { details: StringMap }) {
    return <Column style={{marginTop: 5}}>
        <table style={{borderSpacing: 0}}>
            <tbody>
            {recordToArray(details, (name, detail, index) => {
                const dividerColor = index % 2 == 1 ? Colors.grayDivider : Colors.grayDividerContrast
                const bottomDividerBorder = `1px solid ${dividerColor}`
                const topDividerBorder = index === 0 ? `1px solid ${Colors.grayDivider}` : undefined
                return <Fragment key={name}>
                    <tr>
                        <td style={{
                            fontWeight: "bold", padding: 7, borderRight: `1px solid ${primaryColor}`,
                            borderBottom: bottomDividerBorder, borderTop: topDividerBorder,
                            borderLeft: `1px solid ${Colors.grayDivider}`
                        }}>{name}</td>
                        <td style={{
                            padding: 7,
                            borderBottom: bottomDividerBorder,
                            borderTop: topDividerBorder,
                            borderRight: `1px solid ${Colors.grayDivider}`
                        }}>{String(detail)}</td>
                    </tr>
                </Fragment>
            })}
            </tbody>
        </table>


    </Column>
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // @ts-ignore
        backgroundColor: theme.palette.common.black,
        // @ts-ignore
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },

}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // @ts-ignore
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



function LogLinesUi({logs}: { logs: LogLine[] }) {
    const details = logs.filter(l => isDetailLog(l)) as DetailLog[]
    const messages = logs.filter(l => isMessageLog(l)) as MessageLog[]

    return <Row>
        <KeyValueTable details={details.toRecord(l => [l.key, l.value])}/>
        <Column style = {{padding: 20}}>
            {messages.map(m => <MessageLogUi message={m}/>)}
        </Column>
    </Row>
}


function MessageLogUi({message}: { message: MessageLog }) {
    const color = message.severity === "Error" ? "red"  : message.severity === "Warn" ? "yellow" : textColor
    return <Row>
        <Typography variant = {"subtitle2"} style = {{paddingRight: 5, color: Colors.grayedOutText, alignSelf: "center"}}>
            {timeToString(message.time) + " "}
        </Typography>
        <span style = {{color: color}}>
            {message.message}
        </span>
    </Row>
}

function dateToString(date: Dayjs): string {
    return `${dayToString(date)} ${timeToString(date)}`
}

function dayToString(date: Dayjs): string {
    return `${twoChars(date.day())}/${twoChars(date.month() + 1)}/${twoChars(date.year())}`
}

function timeToString(date: Dayjs): string {
    return `${simpleTimeToString(date)}:${threeChars(date.millisecond())}`
}
function simpleTimeToString(date: Dayjs): string {
    return `${twoChars(date.hour())}:${twoChars(date.minute())}`
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
            "severity": "Error",
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
            "severity": "Error",
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