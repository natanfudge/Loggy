import {CircularProgress, Typography} from "@mui/material";
import {Fragment, useState} from "react";
import {Endpoint, LogsTitle, ThemeSwitch} from "./Endpoint";
import {Day} from "../core/Day";
import {DEBUG_ENDPOINT, LoggingServer} from "../server/LoggingServer";
import {Column, Row, usePromise} from "../utils/Utils";
import {useScreenSize} from "../utils/ScreenSize";
import {useNavigate} from "react-router-dom";
import {ThemeState} from "./App";
import styles from "./css/loggy.module.css"

const initialFilter = getInitialDayFilterString()

function getInitialDayFilterStrings(): { start: string, end: string } {
    const start = Day.beforeDays(1)
    const end = Day.today()
    if (start.year === end.year) {
        if (start.month === end.month) {
            return {start: start.dayString(), end: end.dayString()}
        } else {
            return {start: start.dateString(), end: end.dateString()}
        }
    } else {
        return {start: start.toString(), end: end.toString()}
    }
}

function getInitialDayFilterString() {
    const {start, end} = getInitialDayFilterStrings()
    return `from:${start} to:${end} `
}

const debugEndpoints = [DEBUG_ENDPOINT, "very long thing of hell"]

export function Logs(props: { theme: ThemeState, endpoint: string | undefined }) {
    // Changed when a refresh is requested, to rerun getEndpoints()
    const [refreshMarker, setRefreshMarker] = useState(false)
    const endpoints = props.endpoint === DEBUG_ENDPOINT ? debugEndpoints : usePromise(LoggingServer.getEndpoints(), [])
    const [filter, setFilter] = useState(initialFilter)
    const endpoint = props.endpoint ?? (endpoints !== undefined ? endpoints[0] : undefined)
    const navigate = useNavigate()
    const screen = useScreenSize()

    if (endpoints !== undefined) {
        if (endpoints.length === 0) {
            return <Typography>
                No endpoints defined.
            </Typography>
        } else if (endpoint !== undefined && !endpoints.includes(endpoint)) {
            return <Typography>
                Bad route.
            </Typography>
        }
    }
    return <Column /*style={{height: "100%", width: "100%", justifyContent: "space-between"}} */className={styles.logsColumn}>
            <LogsTitle endpoints={endpoints}
                       query={{
                           value: {endpoint, filter},
                           onChange: (value) => {
                               if (value.endpoint !== endpoint) {
                                   navigate("/logs/" + value.endpoint)
                               }
                               setFilter(value.filter)
                           }
                       }}
                // endpoint={{value: endpoint, onChange: (endpoint) => navigate("/logs/" + endpoint)}}
                // timeRange={{value: timeRange, onChange: setTimeRange}}
                       theme={props.theme}
                       onRefresh={() => {
                           LoggingServer.refreshLog()
                           setRefreshMarker(old => !old)
                       }}
                // filter={filter}
                // setFilter={setFilter}
            />

            {endpoint !== undefined ?
                <Endpoint query={{endpoint, filter}}
                    // filter={filter} startDay={Day.ofDate(timeRange.startDay)}
                    // endDay={Day.ofDate(timeRange.endDay)}
                          theme={props.theme}
                    // endpoint={endpoint}
                          refreshMarker={refreshMarker}/>
                : <CircularProgress/>
            }

            {screen.isPhone && <Fragment>
                <div style={{flexGrow: 1, height: 10}}/>
                <ThemeSwitch themeState={props.theme}/>
                <div style={{height: 10}}/>
            </Fragment>}

        </Column>
        {/*{!screen.isPhone && <TimeRangeSelector state={{value: timeRange, onChange: setTimeRange}}/>}*/}
}
