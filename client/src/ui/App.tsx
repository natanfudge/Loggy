import React, {useState} from 'react'
import {CircularProgress, createTheme, CssBaseline, Theme as MaterialUiTheme, ThemeProvider} from "@mui/material";
import "../extensions/ExtensionsImpl"
import {Endpoint, LogsTitle} from "./Endpoint";
import {Column, usePromise} from "../utils/Utils";
import {dayJsToDay, LoggingServer} from "../server/LoggingServer";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BrowserRouter, Route, Routes, useNavigate, useParams} from "react-router-dom";


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
        <Route path = "/" element={<App theme={props.theme} endpoint={undefined}/>}/>
        <Route path = "/:endpoint" element={<RoutedEndpointApp theme={props.theme}/>}/>
        <Route path = "*" element = {"Nothing Here"}/>
    </Routes>
    // const endpoints = usePromise(LoggingServer.getEndpoints(), [])
    // if (endpoints === undefined) {
    //     return <CircularProgress/>
    // } else {
    //     return <AppWithEndpoints endpoints={endpoints} theme={props.theme}/>
    // }
}

function RoutedEndpointApp(props: {theme: ThemeState}) {
    const {endpoint} = useParams<"endpoint">()
    return <App theme = {props.theme} endpoint={endpoint}/>
}


// function App(props: { theme: ThemeState }) {
//     const endpoints = usePromise(LoggingServer.getEndpoints(), [])
//     if (endpoints === undefined) {
//         return <CircularProgress/>
//     } else {
//         return <AppWithEndpoints endpoints={endpoints} theme={props.theme}/>
//     }
// }

function App(props: { theme: ThemeState, endpoint: string | undefined }) {
    const endpoints = usePromise(LoggingServer.getEndpoints(), [])
    const [day, setDay] = useState(dayjs())
    const endpoint = props.endpoint ?? (endpoints !== undefined? endpoints[0] : undefined)
    const navigate = useNavigate()
    return <Column>
        <LogsTitle endpoints={endpoints} endpoint={{value: endpoint, onChange: (endpoint) => navigate("/" + endpoint)}}
                   day={{value: day, onChange: setDay}} theme={props.theme}/>

        <Endpoint day={dayJsToDay(day)} theme={props.theme} endpoint={endpoint}/>
    </Column>
}

export default App
declare module '@emotion/react' {
    export interface Theme extends MaterialUiTheme {

    }
}