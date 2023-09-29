import React, {useState} from 'react'
import * as mui from "@mui/material";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import "../fudge-lib/extensions/Extensions"
import "../fudge-lib/extensions/ExtensionsImpl"
import {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BrowserRouter, Route, Routes, useParams} from "react-router-dom";
import {AnalyticsPage} from "./AnalyticsPage";
import {Logs} from "./Logs";
import {Endpoint, endpointFromString, SpecialEndpoint} from "../model/Endpoint";
// import {ThemeProvider} from "@emotion/react";

declare module "@emotion/react" {
    // Allow using ThemeColors in styled
    export interface Theme extends mui.Theme {
        custom: CustomTheme
    }
}

export type CustomTheme = {
    secondaryBackground: string,
    secondaryBackgroundBorder: string,
    secondaryBackgroundSeparator: string,
    selectedCompletionBackground: string
}

declare module '@mui/material/styles' {
    interface Theme {
        custom: CustomTheme
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        custom: CustomTheme
    }
}



//TODO: I need a rendering limit for very very large logs.

export function AppWrapper() {
    const [isDark, setIsDark] = useState<boolean>(true)
    const darkTheme = createTheme({
        custom: {
            secondaryBackground: "rgb(65,64,64)",
            secondaryBackgroundBorder: "rgb(103,103,103)",
            secondaryBackgroundSeparator: "rgb(148,148,148)",
            selectedCompletionBackground: "rgb(73,84,119)"
        },
        palette: {
            mode: isDark ? 'dark' : "light"
        }
    });


    return <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline/>
            <div className={isDark? undefined: "light"} style = {{height: "100%"}}>
                <BrowserRouter>
                    <RoutedApp theme={{setThemeDark: setIsDark, isDark}}/>
                </BrowserRouter>
            </div>

        </LocalizationProvider>
    </ThemeProvider>
}




export interface ThemeState {
    isDark: boolean,
    setThemeDark: (isDark: boolean) => void
}


function RoutedApp(props: { theme: ThemeState }) {
    return <Routes>
        <Route path="/logs/" element={<Logs key={undefined} theme={props.theme} endpoint={SpecialEndpoint.All}/>}/>
        <Route path="/logs/:endpoint" element={<RoutedLogs theme={props.theme}/>}/>
        <Route path="/logs/:endpoint/stats" element={<RoutedAnalytics theme={props.theme}/>}/>
        <Route path="*" element={"Nothing Here"}/>
    </Routes>
}

// type PageContents = {
//     endpoint: Endpoint
// }

// function Page({Content}: { Content: React.FC<PageContents> }) {
//     const {endpoint} = useParams<"endpoint">()
//     return <Logs key={endpoint} theme={props.theme} endpoint={endpoint}/>}/>
//     return <Content endpoint={ endpoint === undefined? SpecialEndpoint.All : endpointFromString(endpoint)}/>
// }

function RoutedLogs(props: { theme: ThemeState }) {
    const {endpoint} = useParams<"endpoint">()
    return <Logs key={endpoint} theme={props.theme} endpoint={endpoint === undefined? SpecialEndpoint.All : endpointFromString(endpoint)}/>
}

function RoutedAnalytics(props: { theme: ThemeState }) {
    const {endpoint} = useParams<"endpoint">()
    return <AnalyticsPage theme={props.theme} endpoint={endpoint!}/>
}


export interface TimeRange {
    startDay: Dayjs
    endDay: Dayjs
}

