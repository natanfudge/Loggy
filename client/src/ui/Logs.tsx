
import {CircularProgress, Typography} from "@mui/material";
import {Fragment, useState} from "react";
import {Endpoint, FilterConfig, LogsTitle, ThemeSwitch, TimeRangeSelector} from "./Endpoint";
import {Day} from "../core/Day";
import {DEBUG_ENDPOINT, LoggingServer} from "../server/LoggingServer";
import {Column, Row, usePromise} from "../utils/Utils";
import {useScreenSize} from "../utils/ScreenSize";
import {useNavigate} from "react-router-dom";
import {ThemeState, TimeRange} from "./App";
import dayjs from "dayjs";


export function Logs(props: { theme: ThemeState, endpoint: string | undefined }) {
    // Changed when a refresh is requested, to rerun getEndpoints()
    const [refreshMarker, setRefreshMarker] = useState(false)
    const endpoints = props.endpoint === DEBUG_ENDPOINT ? [DEBUG_ENDPOINT, "very long thing of hell"] : usePromise(LoggingServer.getEndpoints(), [])
    const [timeRange, setTimeRange] = useState<TimeRange>({startDay: dayjs(), endDay: dayjs()})
    const endpoint = props.endpoint ?? (endpoints !== undefined ? endpoints[0] : undefined)
    const navigate = useNavigate()
    const screen = useScreenSize()
    const [filter, setFilter] = useState<FilterConfig>({info: true, warn: true, error: true})

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
    return <Row style={{justifyContent: "space-between"}}>
        <Column style={{height: "100%"}} className="material-text">
            <LogsTitle endpoints={endpoints}
                       endpoint={{value: endpoint, onChange: (endpoint) => navigate("/logs/" + endpoint)}}
                       timeRange={{value: timeRange, onChange: setTimeRange}} theme={props.theme}
                       onRefresh={() => {
                           LoggingServer.refreshLog()
                           setRefreshMarker(old => !old)
                       }}
                       filter={filter}
                       setFilter={setFilter}
            />

            {endpoint !== undefined ?
                <Endpoint filter={filter} startDay={Day.ofDate(timeRange.startDay)}
                          endDay={Day.ofDate(timeRange.endDay)}
                          theme={props.theme} endpoint={endpoint} refreshMarker={refreshMarker}/>
                : <CircularProgress/>
            }

            {screen.isPhone && <Fragment>
                <div style={{flexGrow: 1, height: 10}}/>
                <ThemeSwitch themeState={props.theme}/>
                <div style={{height: 10}}/>
            </Fragment>}

        </Column>
        {!screen.isPhone && <TimeRangeSelector state={{value: timeRange, onChange: setTimeRange}}/>}
    </Row>
}
