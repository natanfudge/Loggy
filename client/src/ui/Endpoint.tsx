import {addAlphaToColor, Column, dayToString, Row, State, timeToString, usePromise} from "../utils/Utils";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Divider,
    styled,
    Switch, TableCell, tableCellClasses,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
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
import {ExpandMore} from "@mui/icons-material";
import {LongRightArrow} from "./LongRightArrow";
import React, {Fragment} from "react";
import {KeyValueTable} from "./KeyValueTable";
import {ThemeState} from "./App";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {Dropdown} from "./UiUtils";
import {LoggingServer} from "../server/LoggingServer";
//TODO: day selection
//TODO: endpoint selection

export function Endpoint(props: { theme: ThemeState, endpoint: string }) {
    const logsJson = usePromise(LoggingServer.getLogs(props.endpoint),[props.endpoint])
    if(logsJson === undefined){
       return <Typography>
            TODO
        </Typography>
    } else{
        const logs = parseLogEvents(logsJson)
        // const endpoint = logs[0].name
        // const day = dayToString(logs[0].startTime)

        return <div>
            {/*<LogsTitle endpoint={endpoint} day={day} theme={props.theme}/>*/}

            <Column style={{width: "fit-content"}}>
                {logs.map((l, i) => <LogEventAccordion key={i} log={l}/>)}
            </Column>
        </div>
    }

}

const NoticableDivider = styled(Divider)(({theme}) => ({
    backgroundColor: theme.palette.text.primary
}));

export function LogsTitle(props: {endpoints: string[], endpoint: State<string>, day: State<Dayjs>, theme: ThemeState }) {
    return <Row style={{padding: 10, paddingLeft: 30}}>

        <Column>
            <Row style = {{alignItems: "center"}}>
                <Typography style = {{marginRight: 10, marginBottom: 4, alignSelf: "end"}}>
                    Logs for
                </Typography>
                <Dropdown options={props.endpoints} value={props.endpoint.value} onValueChanged={props.endpoint.onChange}
                          style={{width: "max-content"}}/>
            </Row>
            <NoticableDivider style = {{marginTop: -1}}/>
        </Column>



        <div style={{flexGrow: 1}}/>

        <ThemeSwitch theme={props.theme}/>
        <DaySelection day={props.day}/>
        {/*<Typography variant={"h6"} style={{paddingRight: 20, alignSelf: "center"}}>*/}
        {/*    {props.day}*/}
        {/*</Typography>*/}
    </Row>;
}

export function DaySelection(props: { day: State<Dayjs> }) {
    return <DesktopDatePicker inputFormat={"DD/MM/YY"}
                              onChange={(value => {
                                  if (value !== null) props.day.onChange(value)
                              })}
                              value={props.day.value}
                              renderInput={(params) => <TextField {...params}  style = {{width: "8rem"}}/>}/>
}



function ThemeSwitch({theme}: { theme: ThemeState }) {
    return <ThemeBorder>
        <Typography style={{alignSelf: "center"}}>
            {theme.isDark ? "Dark" : "Light"}
        </Typography>
        <Switch sx = {{alignSelf: "center"}} checked={!theme.isDark} onChange={(event, checked) => {
            theme.setThemeDark(!checked)
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
                    <LongRightArrow
                        style={{height: "20px", width: "46px", marginLeft: 4, marginRight: 2, alignSelf: "center"}}
                        color={textColor}/>
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
                            style={{paddingLeft: i == 0 ? 0 : 20}} key={i}>
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
            {messages.map((m, i) => <MessageLogUi key={i} message={m}/>)}
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

