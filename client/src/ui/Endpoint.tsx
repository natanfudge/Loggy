import {
    addAlphaToColor,
    Column,
    mapState,
    millsecondTimeToString,
    Row,
    State,
    timeToString,
    unixMs,
    usePromise
} from "../utils/Utils";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    List,
    Pagination,
    styled,
    Switch,
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
    isWarningLog,
    LogEvent,
    LogLine,
    MessageLog
} from "../core/Logs";
import {ExpandMore, Refresh, ShowChart} from "@mui/icons-material";
import {LongRightArrow} from "./LongRightArrow";
import React, {CSSProperties, Fragment, useCallback, useState} from "react";
import {KeyValueTable} from "./KeyValueTable";
import {ThemeState, TimeRange} from "./App";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import {Dropdown} from "./UiUtils";
import {LoggingServer} from "../server/LoggingServer";
import {useScreenSize} from "../utils/ScreenSize";
import {Day} from "../core/Day";
import {useNavigate} from "react-router-dom";
import {LoggySearchBar} from "./search/LoggySearchBar";


export function Endpoint(props: {
    query: LogsQuery,
    theme: ThemeState,
    // endpoint: string,
    // startDay: Day,
    // endDay: Day,
    refreshMarker: boolean,
    // filter: FilterConfig
}) {
    const [page, setPage] = useState(0)
    const response = usePromise(
        LoggingServer.getLogs(props.query), [props.query.endpoint, props.query.filter]
    )

    if (response === undefined) {
        return <Typography>
            <CircularProgress/>
        </Typography>
    } else {
        return <Fragment>
            <List style={{maxHeight: "100%", overflow: "auto"}}>
                <div style={{width: "fit-content"}}>
                    {response.logs
                        // .filter(log => shouldDisplayLog(log, props.filter))
                        .map((l, i) => <LogEventAccordion key={i} log={l}/>
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
        </Fragment>
    }
}

// function shouldDisplayLog(log: LogEvent, filter: FilterConfig): boolean {
//     if (hasErrorLogs(log)) return filter.error
//     if (hasWarningLogs(log)) return filter.warn
//     return filter.info
// }

const NoticableDivider = styled(Divider)(({theme}) => ({
    backgroundColor: theme.palette.text.primary
}));

export interface LogsQuery {
    filter: string,
    endpoint: string | undefined
}

export function LogsTitle(props: {
    endpoints: string[] | undefined,
    query: State<LogsQuery>,
    onRefresh: () => void,
    theme: ThemeState
}) {
    const isPhone = useScreenSize().isPhone
    const query = props.query
    const endpoint = query.value.endpoint
    const onEndpointValueChange = useCallback((v: string) => query.onChange(({
        filter: query.value.filter,
        endpoint: v
    })), [])
    return <Row style={{padding: 10, paddingLeft: isPhone ? undefined : 30}}>

        <Column style={{paddingLeft: isPhone ? 10 : undefined, alignSelf: "center"}}>
            <Row>
                <Row style={{alignItems: "center"}}>
                    {!isPhone && <Typography style={{marginRight: 10, marginBottom: 4, alignSelf: "end"}}>
                        Logs for
                    </Typography>}
                    {/*When props.endpoints is defined, props.endpoint.value must also be defined*/}
                    {props.endpoints === undefined ? <CircularProgress/> :
                        <MaxWidthDropdown options={props.endpoints} value={endpoint!}
                                          onValueChanged={onEndpointValueChange}
                        />}


                </Row>
                <IconButton style={{height: "fit-content", alignSelf: "center", paddingLeft: 20}}
                            onClick={props.onRefresh}>
                    <Refresh/>
                </IconButton>
                {endpoint !== undefined && <PaddedStatsButton endpoint={endpoint}/>}
            </Row>

            {/*<NoticableDivider style={{marginTop: -1}}/>*/}
            {/*{isPhone && <FilterConfigSelection row={false} config={props.filter} setConfig={props.setFilter}/>}*/}
            {/*{isPhone && <TimeRangeSelector state={props.timeRange} row={true}/>}*/}
        </Column>


        <LoggySearchBar query={mapState(query, (q) => q.filter, (filter) => ({endpoint, filter}))}/>

        {!isPhone && <Fragment>

            {/*<FilterConfigSelection row={true} config={props.filter} setConfig={props.setFilter}/>*/}
            <ThemeSwitch themeState={props.theme}/>
        </Fragment>}

        {/*{isPhone && <Fragment>*/}
        {/*    <TimeRangeSelector state={props.timeRange}/>*/}
        {/*{props.endpoint.value !== undefined && <StatsButton endpoint={props.endpoint.value}/>}*/}
        {/*</Fragment> }*/}


        {/*{screen.isPhone && }*/}
        {/*</Column>*/}
        {/*{}*/}
    </Row>
}

const MaxWidthDropdown = styled(Dropdown)`
  width: max-content;
`


const PaddedStatsButton = styled(StatsButton)`
  padding-right: 20px;
`

function StatsButton(props: { endpoint: string, className?: string }) {
    const navigate = useNavigate()
    return <IconButton className={props.className} style={{marginLeft: 20, height: "min-content", alignSelf: "center"}}
                       onClick={() => navigate(`/logs/${props.endpoint}/stats`)}>
        <ShowChart/>
    </IconButton>
}


export function TimeRangeSelector(props: {
    state: State<TimeRange>,
    className?: string,
    style?: CSSProperties,
    row?: boolean
}) {
    const timeRange = props.state.value
    const screen = useScreenSize()
    const isRow = props.row ?? false
    return <Column style={{padding: screen.isPhone ? 0 : 10, flexDirection: isRow ? "row" : "column", ...props.style}}
                   className={props.className}>
        <Row style={{paddingBottom: isRow ? 0 : 10}}>
            <TimeRangeText> Start</TimeRangeText>
            <DaySelection day={{
                value: timeRange.startDay,
                onChange: (value) => props.state.onChange({...timeRange, startDay: value})
            }}/>
        </Row>
        <Row style={{alignSelf: "end", paddingLeft: 5}}>
            <TimeRangeText style={{marginRight: 3}}> End </TimeRangeText>
            <DaySelection day={{
                value: timeRange.endDay,
                onChange: (value) => props.state.onChange({...timeRange, endDay: value})
            }}/>
        </Row>
    </Column>;
}


const TimeRangeText = styled("span")`
  align-self: center;
  padding: 5px;
`


function FilterConfigSelection({config, setConfig, row}: {
    config: FilterConfig,
    setConfig: (config: FilterConfig) => void,
    row: boolean
}) {
    const screen = useScreenSize();
    const phone = screen.isPhone
    return <FormGroup row>
        <FormControlLabel
            control={<Checkbox checked={config.info} onChange={(e) => setConfig({...config, info: e.target.checked})}/>}
            label={phone ? "I" : "Info"}/>
        <FormControlLabel
            control={<Checkbox checked={config.warn} onChange={(e) => setConfig({...config, warn: e.target.checked})}/>}
            label={phone ? "W" : "Warning"}/>
        <FormControlLabel control={<Checkbox checked={config.error}
                                             onChange={(e) => setConfig({...config, error: e.target.checked})}/>}
                          label={phone ? "E" : "Error"}/>
    </FormGroup>
}

export interface FilterConfig {
    info: boolean
    warn: boolean
    error: boolean
}


export function DaySelection(props: { day: State<Dayjs> }) {
    return <DesktopDatePicker inputFormat={"DD/MM/YY"}
                              onChange={(value => {
                                  if (value !== null) props.day.onChange(value)
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


function LogEventAccordion({log}: { log: LogEvent }) {
    const theme = useTheme();
    const errored = hasErrorLogs(log)
    const warned = hasWarningLogs(log)
    const textColor = errored ? theme.palette.error.main : warned ? theme.palette.warning.main : theme.palette.text.primary
    const [expanded, setExpanded] = useState(false);

    return <Accordion expanded={expanded} onChange={(e, newValue) => setExpanded(newValue)}>
        <LogEventSummary expandIcon={<ExpandMore/>} style={{color: textColor}}>
            <LogEventSummaryText log={log} expanded={expanded} textColor={textColor} errored={errored} warned={warned}/>
        </LogEventSummary>
        <AccordionDetails>
            <LogEventContent log={log}/>
        </AccordionDetails>
    </Accordion>
}

export function hasErrorLogs(log: LogEvent): boolean {
    return log.logs.some(l => isErrorLog(l))
}

export function hasWarningLogs(log: LogEvent): boolean {
    return log.logs.some(l => isWarningLog(l))
}

function LogEventSummaryText({log, expanded, textColor, errored, warned}: {
    log: LogEvent,
    expanded: boolean,
    textColor: string,
    errored: boolean,
    warned: boolean
}) {
    const duration = `${unixMs(log.endTime) - unixMs(log.startTime)}ms`
    const suffix = errored ? " - ERROR" : warned ? " - Warning" : ""
    const screen = useScreenSize()
    const date = `${Day.ofDate(log.startTime).dateString()} - `
    if (expanded) {
        return <Fragment>
            {date}
            {millsecondTimeToString(log.startTime)}
            {/*Style must be passed explicitly to work properly with the svg*/}
            <LongRightArrow style={durationArrowStyle} color={textColor}/>
            {millsecondTimeToString(log.endTime) + ` (${duration}${screen.isPhone ? "" : " total"})`}
        </Fragment>
    } else {
        return <Fragment>
            {date}
            {timeToString(log.startTime) + ` (${duration})` + suffix}
        </Fragment>
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

    const screen = useScreenSize()

    return <div style={{display: "flex", flexDirection: screen.isPhone ? "column" : "row"}}>
        <KeyValueTable details={details.toRecord(l => [l.key, l.value])}/>
        <Column style={{paddingLeft: screen.isPhone ? 0 : 20, paddingTop: 10}}>
            {messages.map((m, i) => <MessageLogUi key={i} message={m}/>)}
        </Column>
    </div>
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

