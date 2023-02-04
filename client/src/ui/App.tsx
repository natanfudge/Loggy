import React, {Fragment, useState} from 'react'
import '../App.css'
import {
    DetailLog,
    ErrorLog,
    isDetailLog,
    isErrorLog,
    isMessageLog,
    LogEvent,
    LogLine,
    MessageLog,
    parseLogEvents
} from "../core/Logs";
import {addAlphaToColor, Column, dayToString, Row, timeToString} from "./Utils";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    createTheme,
    CssBaseline,
    Switch,
    Theme as MaterialUiTheme,
    ThemeProvider,
    Typography,
    useTheme
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import "../extensions/ExtensionsImpl"
import styled from "@emotion/styled";
import {KeyValueTable} from "./KeyValueTable";
import {LongRightArrow} from "./LongRightArrow";
import {Endpoint} from "./Endpoint";


export function AppWrapper() {
    const [isDark, setIsDark] = useState<boolean>(true)
    const darkTheme = createTheme({
        palette: {
            mode: isDark ? 'dark' : "light",
        },
    });

    return <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <App theme={{setThemeDark: setIsDark, isDark}}/>
    </ThemeProvider>
}


export interface ThemeState {
    isDark: boolean,
    setThemeDark: (isDark: boolean) => void
}

function App(props: { theme: ThemeState }) {
    return <Endpoint theme={props.theme} endpoint={"getCrash"}/>
}

export default App
declare module '@emotion/react' {
    export interface Theme extends MaterialUiTheme {

    }
}