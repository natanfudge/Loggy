import React, {useState} from 'react'
import '../App.css'
import {CircularProgress, createTheme, CssBaseline, Theme as MaterialUiTheme, ThemeProvider} from "@mui/material";
import "../extensions/ExtensionsImpl"
import {DaySelection, Endpoint, LogsTitle} from "./Endpoint";
import {Column, usePromise} from "../utils/Utils";
import {LoggingServer} from "../server/LoggingServer";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


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
            <App theme={{setThemeDark: setIsDark, isDark}}/>
        </LocalizationProvider>
    </ThemeProvider>
}


export interface ThemeState {
    isDark: boolean,
    setThemeDark: (isDark: boolean) => void
}

function App(props: { theme: ThemeState }) {
    // const [day, setDay] = useState(dayjs())
    // return <DaySelection day={{value: day, onChange: setDay}}/>
    const endpoints = usePromise(LoggingServer.getEndpoints(), [])
    if (endpoints === undefined) {
        return <CircularProgress/>
    } else {
        return <AppWithEndpoints endpoints={endpoints} theme={props.theme}/>
    }
}

function AppWithEndpoints(props: { theme: ThemeState, endpoints: string[] }) {
    const [endpoint, setEndpoint] = useState("getCrash")
    const [day, setDay] = useState(dayjs())
    return <Column>
        <LogsTitle endpoints={props.endpoints} endpoint={{value: endpoint, onChange: setEndpoint}}
                   day={{value: day, onChange: setDay}} theme={props.theme}/>

        <Endpoint theme={props.theme} endpoint={endpoint}/>
    </Column>
}

export default App
declare module '@emotion/react' {
    export interface Theme extends MaterialUiTheme {

    }
}