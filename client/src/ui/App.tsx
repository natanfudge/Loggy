import React, {Fragment, useState} from 'react'
import {
    CircularProgress,
    createTheme,
    CssBaseline, styled,
    Theme as MaterialUiTheme,
    ThemeProvider,
    Typography
} from "@mui/material";
import "../extensions/ExtensionsImpl"
import {DaySelection, Endpoint, FilterConfig, LogsTitle, ThemeSwitch, TimeRangeSelector} from "./Endpoint";
import {Column, Row, State, usePromise} from "../utils/Utils";
import {dayJsToDay, DEBUG_ENDPOINT, LoggingServer} from "../server/LoggingServer";
import dayjs, {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BrowserRouter, Route, Routes, useNavigate, useParams} from "react-router-dom";
import {useScreenSize} from "../utils/ScreenSize";


export function AppWrapper() {
    const [isDark, setIsDark] = useState<boolean>(true)
    const darkTheme = createTheme({
        palette: {
            mode: isDark ? 'dark' : "light",
        },
    });

    return <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline/>
            <BrowserRouter>
                <RoutedApp theme={{setThemeDark: setIsDark, isDark}}/>
            </BrowserRouter>
        </LocalizationProvider>
    </ThemeProvider>
}


export interface ThemeState {
    isDark: boolean,
    setThemeDark: (isDark: boolean) => void
}


function RoutedApp(props: { theme: ThemeState }) {
    return <Routes>
        <Route path="/logs/" element={<App theme={props.theme} endpoint={undefined}/>}/>
        <Route path="/logs/:endpoint" element={<RoutedEndpointApp theme={props.theme}/>}/>
        <Route path="*" element={"Nothing Here"}/>
    </Routes>
}

function RoutedEndpointApp(props: { theme: ThemeState }) {
    const {endpoint} = useParams<"endpoint">()
    return <App theme={props.theme} endpoint={endpoint}/>
}

function App(props: { theme: ThemeState, endpoint: string | undefined }) {
    // Changed when a refresh is requested, to rerun getEndpoints()
    const [refreshMarker, setRefreshMarker] = useState(false)
    const endpoints = props.endpoint === DEBUG_ENDPOINT ? [DEBUG_ENDPOINT] : usePromise(LoggingServer.getEndpoints(), [])
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
    return <Row style = {{justifyContent: "space-between"}}>
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
                <Endpoint filter={filter} startDay={dayJsToDay(timeRange.startDay)} endDay={dayJsToDay(timeRange.endDay)}
                          theme={props.theme} endpoint={endpoint} refreshMarker={refreshMarker}/>
                : <CircularProgress/>
            }

            {screen.isPhone && <Fragment>
                <div style={{flexGrow: 1, height: 10}}/>
                <ThemeSwitch theme={props.theme}/>
                <div style={{height: 10}}/>
            </Fragment>}

        </Column>
        {!screen.isPhone && <TimeRangeSelector state={{value: timeRange, onChange: setTimeRange}}/>}
    </Row>
}



export interface TimeRange {
    startDay: Dayjs
    endDay: Dayjs
}

export default App
declare module '@emotion/react' {
    export interface Theme extends MaterialUiTheme {

    }
}