import {CircularProgress, Typography} from "@mui/material";
import React, {Fragment, useState} from "react";
import {Endpoint, ThemeSwitch} from "./Endpoint";
import {Day} from "../core/Day";
import {debugEndpoints, LoggingServer} from "../server/LoggingServer";
import {usePromise} from "../utils/Utils";
import {useScreenSize} from "../utils/ScreenSize";
import {useNavigate} from "react-router-dom";
import {ThemeState} from "./App";
import styles from "./css/loggy.module.css"
import {LogsTitle} from "./LogsTitle";
import {isLogsResponseSuccess} from "../server/Api";
import {usePersistentState} from "../fudge-lib/state/PersistentState";
import {useStateObject} from "../fudge-lib/state/State";
import {Column} from "../fudge-lib/Flow";

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
    const navigate = useNavigate()
    const screen = useScreenSize()
    const [refreshMarker, setRefreshMarker] = useState(false) // Changed when a refresh is requested, to rerun getEndpoints()
    const page = useStateObject(0)
    const endpoints = useEndpoints(props.endpoint)
    const endpoint = activeEndpoint(props.endpoint, endpoints)
    // Added -2 because of persistent state format change
    const query = usePersistentState(`query-string-${endpoint}-2`, initialFilter)
    const endpointQuery = query.mapType(q => ({query: q, endpoint}), eq => eq.query)
        .onSet(({endpoint}) => navigate("/logs/" + (endpoint ?? "")))

    // console.log(`Endpoint: ${endpoint}, query: ${JSON.stringify(query)}, page: ${page.value}`)

    const logsResponse = usePromise(
        LoggingServer.getLogs({endpoint, query: query.value, page: page.value}), [endpoint, query.value, page.value]
    )


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
    return <Column className={styles.logsColumn}>
        <LogsTitle endpoints={endpoints}
                   queryError={isLogsResponseSuccess(logsResponse) ? undefined : logsResponse?.error}
                   endpointQuery={endpointQuery}
                   theme={props.theme}
                   onRefresh={() => {
                       LoggingServer.refreshLog({page: page.value, ...endpointQuery.value})
                       setRefreshMarker(old => !old)
                   }}
        />

        {endpoint !== undefined ?
            <Endpoint page={page}
                      logs={logsResponse}
                      theme={props.theme}
                      refreshMarker={refreshMarker}/>
            : <CircularProgress/>
        }

        {screen.isPhone && <Fragment>
            <div style={{flexGrow: 1, height: 10}}/>
            <ThemeSwitch themeState={props.theme}/>
            <div style={{height: 10}}/>
        </Fragment>}

    </Column>
}

function useEndpoints(endpoint: string | undefined) {
    return debugEndpoints.includes(endpoint ?? "") ? debugEndpoints : usePromise(LoggingServer.getEndpoints(), []);
}

function activeEndpoint(endpoint: string | undefined, endpoints: string[] | undefined) {
    return endpoint ?? (endpoints !== undefined ? endpoints[0] : undefined);
}