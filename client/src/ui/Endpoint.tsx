import {addAlphaToColor, millsecondTimeToString, timeToString, unixMs} from "../utils/Utils";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    List,
    Pagination,
    styled,
    Switch,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {
    AllSeverities,
    DetailLog,
    ErrorLog,
    isDetailLog,
    isErrorLog,
    isMessageLog,
    isWarningLog,
    LogEvent,
    LogLine,
    MessageLog,
    Severity, severityValue
} from "../core/Logs";
import {ExpandMore} from "@mui/icons-material";
import {LongRightArrow} from "./LongRightArrow";
import React, {CSSProperties, Fragment, useState} from "react";
import {KeyValueTable} from "./KeyValueTable";
import {ThemeState, TimeRange} from "./App";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import {Day} from "../core/Day";
import {GetLogsResponse, isLogsResponseSuccess} from "../server/Api";
import {State, useStateObject} from "../fudge-lib/state/State";
import {Column, Row, SpacedRow} from "../fudge-lib/Flow";
import {Endpoint} from "../model/Endpoint";
import {AppTheme} from "../fudge-lib/AppTheme";
import {useScreenSize} from "../fudge-lib/methods/Gui";
import {Dropdown} from "./UiUtils";


export function EndpointGui(props: {
    page: State<number>,
    logs: GetLogsResponse | undefined,
    showEndpointInLogs: boolean,
    theme: ThemeState,
    refreshMarker: boolean,
}) {
    const [page, setPage] = props.page.destruct()
    const response = props.logs;

    const isPhone = useScreenSize().isPhone

    if (response === undefined) {
        return <Typography>
            <CircularProgress/>
        </Typography>
    } else if (isLogsResponseSuccess(response)) {
        return <>
            <List style={{maxHeight: "100%", overflow: "auto"}}>
                <div style={{minWidth: isPhone ? "100%" : 450}}>
                    {response.logs
                        .map((l, i) => <LogEventAccordion showEndpoint={props.showEndpointInLogs} key={i} log={l}/>
                        )}
                </div>
            </List>
            {
                response.pageCount > 1 &&
                // Pages in Pagination are 0-indexed
                <Pagination count={response.pageCount} page={page + 1}
                            onChange={(_, p) => setPage(p - 1)}
                            style={{alignSelf: "center"}}
                />
            }
        </>
    } else {
        return <>
            {/*Error in query*/}
        </>
    }
}


export interface EndpointQuery {
    query: string,
    endpoint: Endpoint
}


export function TimeRangeSelector(props: {
    state: State<TimeRange>,
    className?: string,
    style?: CSSProperties,
    row?: boolean
}) {
    const screen = useScreenSize()
    const isRow = props.row ?? false
    return <Column style={{padding: screen.isPhone ? 0 : 10, flexDirection: isRow ? "row" : "column", ...props.style}}
                   className={props.className}>
        <Row style={{paddingBottom: isRow ? 0 : 10}}>
            <TimeRangeText> Start</TimeRangeText>
            <DaySelection day={props.state.field("startDay")}/>
        </Row>
        <Row style={{alignSelf: "end", paddingLeft: 5}}>
            <TimeRangeText style={{marginRight: 3}}> End </TimeRangeText>
            <DaySelection day={props.state.field("endDay")}/>
        </Row>
    </Column>;
}


const TimeRangeText = styled("span")`
  align-self: center;
  padding: 5px;
`


export function DaySelection(props: { day: State<Dayjs> }) {
    return <DesktopDatePicker inputFormat={"DD/MM/YY"}
                              onChange={(value => {
                                  if (value !== null) props.day.setValue(value)
                              })}
                              value={props.day.value}
                              renderInput={(params) => <TextField {...params}
                                                                  style={{width: "8rem", alignSelf: "center"}}/>}/>
}


export function ThemeSwitch({themeState, className, style}: {
    themeState: ThemeState,
    className?: string,
    style?: CSSProperties
}) {
    return <ThemeBorder style={style} className={className}>
        <Typography style={{alignSelf: "center"}}>
            {themeState.isDark ? "Dark" : "Light"}
        </Typography>
        <Switch sx={{alignSelf: "center"}} checked={!themeState.isDark} onChange={(event, checked) => {
            themeState.setThemeDark(!checked)
        }}/>
    </ThemeBorder>
}

const ThemeBorder = styled(Row)(({theme}) => ({
    border: `1px solid ${addAlphaToColor(theme.palette.primary.dark, 0.2)}`,
    paddingLeft: "10px",
    marginRight: "5px",
    borderRadius: "10px",
    width: "fit-content",
    alignSelf: "center"
}));


function LogEventAccordion({log, showEndpoint}: { log: LogEvent, showEndpoint: boolean }) {
    const theme = useTheme();
    const errored = hasErrorLogs(log)
    const warned = hasWarningLogs(log)
    const textColor = errored ? theme.palette.error.main : warned ? theme.palette.warning.main : theme.palette.text.primary
    const [expanded, setExpanded] = useState(false);

    return <Accordion expanded={expanded} onChange={(_, newValue) => setExpanded(newValue)}>
        <LogEventSummary expandIcon={<ExpandMore/>} style={{color: textColor}}>
            <LogEventSummaryText showEndpoint={showEndpoint} log={log} expanded={expanded} textColor={textColor} errored={errored} warned={warned}/>
        </LogEventSummary>
        <AccordionDetails>
            {/*Avoid rendering everything in the log when it has not been opened*/}
            {expanded && <LogEventContent log={log}/>}
        </AccordionDetails>
    </Accordion>
}

export function hasErrorLogs(log: LogEvent): boolean {
    return log.logs.some(l => isErrorLog(l))
}

export function hasWarningLogs(log: LogEvent): boolean {
    return log.logs.some(l => isWarningLog(l))
}

function LogEventSummaryText({log, expanded, textColor, errored, warned, showEndpoint}: {
    log: LogEvent,
    expanded: boolean,
    textColor: string,
    errored: boolean,
    warned: boolean,
    /**
     * We only show the endpoint on individual events when we have all endpoints selected.
     * When only one endpoint is selected there's no point in specifying what  endpoint is each event.
     */
    showEndpoint: boolean
}) {

    const date = `${Day.ofDate(log.startTime).dateString()} - `
    return <>
        {showEndpoint && <span style={{color: AppTheme.subtitleText, paddingRight: "0.8rem"}}>{log.name}</span>}
        {date}
        <LogEventSummaryDetails log={log} expanded={expanded} textColor={textColor} errored={errored} warned={warned}/>
    </>
}

function LogEventSummaryDetails(props: { log: LogEvent, expanded: boolean, errored: boolean, warned: boolean, textColor: string }) {
    const log = props.log
    const duration = `${unixMs(log.endTime) - unixMs(log.startTime)}ms`
    const suffix = props.errored ? " - ERROR" : props.warned ? " - Warning" : ""
    const screen = useScreenSize()

    if (props.expanded) {
        return <>
            {millsecondTimeToString(log.startTime)}
            {/*Style must be passed explicitly to work properly with the svg*/}
            <LongRightArrow style={durationArrowStyle} color={props.textColor}/>
            {millsecondTimeToString(log.endTime) + ` (${duration}${screen.isPhone ? "" : " total"})`}
        </>
    } else {
        return <>
            {timeToString(log.startTime) + ` (${duration})` + suffix}
        </>
    }
}

const LogEventSummary = styled(AccordionSummary)`
  display: flex;
  flex-direction: row;
  padding-right: 10px;
  width: 100%;
`
const durationArrowStyle = {height: "20px", width: "46px", marginLeft: 4, marginRight: 4, alignSelf: "center"}

function LogEventContent({log}: { log: LogEvent }) {
    const screen = useScreenSize()
    const otherPadding = screen.isPhone ? 0 : 30
    return <Column
        style={{paddingLeft: otherPadding, paddingTop: 0, paddingBottom: otherPadding, paddingRight: otherPadding}}>
        <LogLinesUi logs={log.logs}/>
        <LogErrorUi log={log}/>
    </Column>
}

function LogErrorUi({log}: { log: LogEvent }) {
    const errors = log.logs.filter(l => isErrorLog(l)) as ErrorLog[]
    if (errors.isEmpty()) return <Fragment/>
    const screen = useScreenSize()

    return <Column style={{paddingTop: 10}}>
        <ErrorTitle variant="h5">
            Errors
        </ErrorTitle>
        <span style={{paddingLeft: screen.isPhone ? 0 : 20}}>
            {errors.map((error, i) =>
                <ErrorContent key={i}>
                    <span style={{textDecoration: "underline"}}>{error.message}</span><br/>
                    <Column style={{paddingLeft: screen.isPhone ? 5 : 20}}>
                        {error.exception.flatMap(element => {
                            return element.stacktrace.split("\n").map((line, i) => <span
                                style={{paddingLeft: i == 0 ? 0 : screen.isPhone ? 5 : 20, lineBreak: "anywhere"}}
                                key={i}>
                            {line}
                        </span>)
                        })}
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
    const severity = useStateObject<Severity>("Verbose")

    const screen = useScreenSize()
    const shownMessages = messages.filter(m => severityValue(m.severity) >= severityValue(severity.value))

    return <div style={{display: "flex", flexDirection: screen.isPhone ? "column" : "row"}}>
        {!details.isEmpty() && <KeyValueTable expand={shownMessages.isEmpty()} details={details.toRecord(l => [l.key, l.value])}/>}
        <Row style={{paddingLeft: screen.isPhone ? 0 : 20, paddingTop: 10, width: screen.isPhone || details.isEmpty()? "100%" : "70%", justifyContent: "space-between"}}>
            <Column >
                {shownMessages.map((m, i) => <MessageLogUi key={i} message={m}/>)}
            </Column>
            <Dropdown options={AllSeverities} state={severity as State<string>} style = {{width: "6rem"}}/>
        </Row>

    </div>
}

const SubtitleText = styled(Typography)(({theme}) => ({
    color: theme.palette.text.disabled,
    paddingRight: 5,
    alignSelf: "center"
}));

function MessageLogUi({message}: { message: MessageLog }) {
    return <Row>
        <SubtitleText variant={"subtitle2"}>
            {timeToString(message.time) + " "}
        </SubtitleText>
        <span style={{color: getSeverityColor(message.severity)}}>
            {message.message}
        </span>
    </Row>
}


function getSeverityColor(severity: Severity): string {
    switch (severity) {
        case "Verbose":
            return AppTheme.subtitleText
        case "Debug":
            return AppTheme.debug
        case "Info":
            return AppTheme.text
        case "Warn":
            return AppTheme.warn
        case "Error":
            return AppTheme.error
    }
}
