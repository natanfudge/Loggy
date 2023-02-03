import React, {Fragment, useState} from 'react'
import '../App.css'
import {
    DetailLog,
    ErrorLog,
    isDetailLog,
    isErrorLog,
    isMessageLog,
    LogEvent,
    LogLine,
    MessageLog,
    parseLogEvents
} from "../core/Logs";
import {addAlphaToColor, Column, dayToString, Row, timeToString} from "./Utils";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    createTheme,
    CssBaseline, Switch,
    Theme as MaterialUiTheme,
    ThemeProvider,
    Typography,
    useTheme
} from "@mui/material";
import {ArrowForward, ExpandMore} from "@mui/icons-material";
import "../extensions/ExtensionsImpl"
import styled from "@emotion/styled";
import {KeyValueTable} from "./KeyValueTable";
import {LongRightArrow} from "./LongRightArrow";


export function AppWrapper() {
    const [isDark,setIsDark] = useState<boolean>(true)
    const darkTheme = createTheme({
        palette: {
            mode: isDark? 'dark' : "light",
        },
    });

    return <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <App setThemeDark={setIsDark} isDark={isDark}/>
    </ThemeProvider>
}

function LogsTitle(props: {endpoint: string, day: string, isDark: boolean, setThemeDark: (isDark: boolean) => void}) {
    return <Row style={{padding: 10, paddingLeft: 50}}>
        <Typography style={{textDecoration: "underline"}} variant={"h5"}>
            Logs for {props.endpoint}<br/>
        </Typography>
        <div style={{flexGrow: 1}}/>

        <ThemeSwitch isDark={props.isDark} setThemeDark={props.setThemeDark}/>
        <Typography variant={"h6"} style={{paddingRight: 20, alignSelf: "center"}}>
            {props.day}
        </Typography>
    </Row>;
}


function App(props: {isDark: boolean, setThemeDark: (isDark: boolean) => void}) {
    const logs = parseLogEvents(json)
    const endpoint = logs[0].name
    const day = dayToString(logs[0].startTime)

    return <div>
        <LogsTitle endpoint={endpoint} day={day} isDark={props.isDark} setThemeDark={props.setThemeDark}/>

        <Column style={{width: "fit-content"}}>
            {logs.map((l, i) => <LogEventAccordion key={i} log={l}/>)}
        </Column>
    </div>
}

function ThemeSwitch(props: {isDark: boolean, setThemeDark: (isDark: boolean) => void}) {
    return <ThemeBorder>
        <Typography style = {{alignSelf: "center"}}>
            {props.isDark? "Dark" : "Light"}
        </Typography>
        <Switch checked = {!props.isDark} onChange = {(event, checked) => {
            props.setThemeDark(!checked)
        }}/>
    </ThemeBorder>
}

const ThemeBorder = styled(Row)(({theme}) => ({
    border: `1px solid ${addAlphaToColor(theme.palette.primary.dark, 0.2)}`,
   paddingLeft: "10px",
    marginRight: "5px",
    borderRadius: "10px"
}));


function LogEventAccordion({log}: { log: LogEvent }) {
    const theme = useTheme();
    const errored = log.logs.some(l => isErrorLog(l))
    const erroredSuffix = errored ? " - ERROR" : ""
    const textColor = errored ? theme.palette.error.main : theme.palette.text.primary
    return <Accordion style={{width: "100%"}} defaultExpanded={false}>
        <AccordionSummary
            expandIcon={<ExpandMore/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Row style={{width: "100%"}}>
                <Row style={{paddingRight: 10}}>
                    <Typography style={{color: textColor}}>
                        {timeToString(log.startTime)}
                    </Typography>
                    <LongRightArrow style = {{height: "20px", width: "46px", marginLeft: 4, marginRight: 2, alignSelf: "center"}} color={textColor}/>
                    <Typography style={{color: textColor}}>
                        {timeToString(log.endTime) + ` (${log.endTime.millisecond() - log.startTime.millisecond()}ms total)` + erroredSuffix}
                    </Typography>
                </Row>
            </Row>

        </AccordionSummary>
        <AccordionDetails>
            <LogEventContent log={log}/>
        </AccordionDetails>
    </Accordion>
}


function LogEventContent({log}: { log: LogEvent }) {
    return <Row style={{padding: 30, paddingTop: 0}}>

        <Column>
            <LogLinesUi logs={log.logs}/>
            <LogErrorUi log={log}/>
        </Column>


    </Row>
}

function LogErrorUi({log}: { log: LogEvent }) {
    const errors = log.logs.filter(l => isErrorLog(l)) as ErrorLog[]
    if (errors.isEmpty()) return <Fragment/>

    return <Column style={{paddingTop: 10}}>
        <ErrorTitle variant="h5">
            Errors
        </ErrorTitle>
        <span style={{paddingLeft: 20}}>
            {errors.map((error, i) =>
                <ErrorContent key={i}>
                    <span style={{textDecoration: "underline"}}>{error.message}</span><br/>
                    <Column style={{paddingLeft: 20}}>
                        {error.exception.stacktrace.split("\n").map((line, i) => <span
                            style={{paddingLeft: i == 0 ? 0 : 20}} key = {i}>
                            {line}
                        </span>)}
                    </Column>

                </ErrorContent>)
            }
        </span>

    </Column>
}


const ErrorTitle = styled(Typography)(({theme}) => ({
    color: theme.palette.error.main,
    textDecoration: "underline"
}));

const ErrorContent = styled("span")(({theme}) => ({
    color: theme.palette.error.main,
}));


function LogLinesUi({logs}: { logs: LogLine[] }) {
    const details = logs.filter(l => isDetailLog(l)) as DetailLog[]
    const messages = logs.filter(l => isMessageLog(l)) as MessageLog[]

    return <Row>
        <KeyValueTable details={details.toRecord(l => [l.key, l.value])}/>
        <Column style={{paddingLeft: 20, paddingTop: 10}}>
            {messages.map((m, i) => <MessageLogUi key = {i} message={m}/>)}
        </Column>
    </Row>
}

const SubtitleText = styled(Typography)(({theme}) => ({
    color: theme.palette.text.disabled,
    paddingRight: 5,
    alignSelf: "center"
}));

function MessageLogUi({message}: { message: MessageLog }) {
    const theme = useTheme()
    const color = message.severity === "Error" ? theme.palette.error.main
        : message.severity === "Warn" ? theme.palette.warning.main : theme.palette.text.primary
    return <Row>
        <SubtitleText variant={"subtitle2"}>
            {timeToString(message.time) + " "}
        </SubtitleText>
        <span style={{color: color}}>
            {message.message}
        </span>
    </Row>
}

declare module '@emotion/react' {
    export interface Theme extends MaterialUiTheme {

    }
}
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