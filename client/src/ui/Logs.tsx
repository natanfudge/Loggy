import {Typography} from "@mui/material";
import React, {Fragment, useState} from "react";
import {EndpointGui, EndpointQuery, ThemeSwitch} from "./Endpoint";
import {LoggingServer} from "../server/LoggingServer";
import {useNavigate} from "react-router-dom";
import {ThemeState} from "./App";
import styles from "./css/loggy.module.css"
import {LogsTitle} from "./LogsTitle";
import {isLogsResponseSuccess} from "../server/Api";
import {usePersistentState} from "../fudge-lib/state/PersistentState";
import {State, useStateObject} from "../fudge-lib/state/State";
import {Column} from "../fudge-lib/Flow";
import {debugEndpoints, Endpoint, endpointToString, isDebugEndpoint, SpecialEndpoint} from "../model/Endpoint";
import {useScreenSize} from "../fudge-lib/methods/Gui";
import {usePromise} from "../fudge-lib/state/UsePromise";

export const initialFilter = ""

export function Logs(props: { theme: ThemeState, endpoint: Endpoint }) {
    const navigate = useNavigate()
    const screen = useScreenSize()
    const [refreshMarker, setRefreshMarker] = useState(false) // Changed when a refresh is requested, to rerun getEndpoints()
    const page = useStateObject(0)
    const endpoints = useEndpoints(props.endpoint)
    const endpoint = props.endpoint
    // Added -2 because of persistent state format change
    const query = usePersistentState(`query-string-${endpoint}-2`, initialFilter)
    const endpointQuery: State<EndpointQuery> = query.mapType(q => ({query: q, endpoint}), eq => eq.query)
        .onSet(({endpoint}) => navigate("/logs/" + endpointToString(endpoint)))


    const logsResponse = usePromise(
        () => LoggingServer.getLogs({endpoint: endpointToString(endpoint), query: query.value, page: page.value}), [endpoint, query.value, page.value]
    )


    if (endpoints !== undefined) {
        if (endpoints.length === 0) {
            return <Typography>
                No endpoints defined.
            </Typography>
        } else if (!endpoints.includes(endpoint)) {
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
                       LoggingServer.refreshLog({page: page.value, endpoint: endpointToString(endpoint), query: query.value})
                       setRefreshMarker(old => !old)
                   }}
        />

            <EndpointGui showEndpointInLogs={endpoint === SpecialEndpoint.All} page={page}
                         logs={logsResponse}
                         theme={props.theme}
                         refreshMarker={refreshMarker}/>

        {screen.isPhone && <Fragment>
            <div style={{flexGrow: 1, height: 10}}/>
            <ThemeSwitch themeState={props.theme}/>
            <div style={{height: 10}}/>
        </Fragment>}

    </Column>
}

function useEndpoints(endpoint: Endpoint): Endpoint[] | undefined {
    const builtinEndpoint: Endpoint[] = [SpecialEndpoint.All]

    // We need to always call the usePromise effect, even when doing debug
    const endpoints = usePromise(() => LoggingServer.getEndpoints(), []);
    // If a debug endpoint is selected we move to a special debug mode where only the debug endpoints are available
    if (isDebugEndpoint(endpoint)) return debugEndpoints
    else return builtinEndpoint.concat(endpoints ?? [])
}
