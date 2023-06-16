import {CircularProgress, Typography} from "@mui/material";
import {Fragment, useCallback, useState} from "react";
import {Endpoint, LogsQuery, ThemeSwitch} from "./Endpoint";
import {Day} from "../core/Day";
import {debugEndpoints, LoggingServer} from "../server/LoggingServer";
import {Column, usePromise} from "../utils/Utils";
import {useScreenSize} from "../utils/ScreenSize";
import {useNavigate} from "react-router-dom";
import {ThemeState} from "./App";
import styles from "./css/loggy.module.css"
import {LogsTitle} from "./LogsTitle";
import {usePersistentState} from "../utils-proposals/collections/persistance/PersistantValue";

export const initialFilter = getInitialDayFilterString()

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
    return ""
    // const {start, end} = getInitialDayFilterStrings()
    // return `from:${start} to:${end} `
}


export function Logs(props: { theme: ThemeState, endpoint: string | undefined }) {
    // Changed when a refresh is requested, to rerun getEndpoints()
    const [refreshMarker, setRefreshMarker] = useState(false)
    const endpoints = debugEndpoints.includes(props.endpoint ?? "") ? debugEndpoints : usePromise(LoggingServer.getEndpoints(), [])
    const endpoint = props.endpoint ?? (endpoints !== undefined ? endpoints[0] : undefined)
    const [queryString, setQueryString] = usePersistentState(initialFilter, `query-string-${endpoint}`)
    const navigate = useNavigate()
    const screen = useScreenSize()
    const onQueryChange = useCallback((value: LogsQuery) => {
        navigate("/logs/" + (value.endpoint ?? ""))
        if (value.endpoint === endpoint) setQueryString(value.query)
    }, [endpoint])

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
    return <Column /*style={{height: "100%", width: "100%", justifyContent: "space-between"}} */
        className={styles.logsColumn}>
        <LogsTitle endpoints={endpoints}
                   query={{
                       value: {endpoint, query: queryString},
                       onChange: onQueryChange
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
            <Endpoint query={{endpoint, query: queryString}}
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
    {/*{!screen.isPhone && <TimeRangeSelector state={{value: timeRange, onChange: setTimeRange}}/>}*/
    }
}
