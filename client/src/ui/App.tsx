import React, {useState} from 'react'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import "../extensions/ExtensionsImpl"
import "../utils-proposals/extensions/ExtensionsImpl"
import {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BrowserRouter, Route, Routes, useParams} from "react-router-dom";
import {AnalyticsPage} from "./AnalyticsPage";
import {Logs} from "./Logs";


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
                {/*{analytics !== undefined && <AnalyticsGraph analytics={analytics}/>}*/}
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
        <Route path="/logs/" element={<Logs theme={props.theme} endpoint={undefined}/>}/>
        <Route path="/logs/:endpoint" element={<RoutedLogs theme={props.theme}/>}/>
        <Route path="/logs/:endpoint/stats" element={<RoutedAnalytics theme={props.theme}/>}/>
        <Route path="*" element={"Nothing Here"}/>
    </Routes>
}

type PageContents = {
    // theme: ThemeState
    endpoint: string | undefined
}

function Page({Content}: { Content: React.FC<PageContents> }) {
    const {endpoint} = useParams<"endpoint">()
    return <Content endpoint={endpoint}/>
}

function RoutedLogs(props: { theme: ThemeState }) {
    return <Page Content={({endpoint}) => <Logs theme={props.theme} endpoint={endpoint}/>}/>
}

function RoutedAnalytics(props: {theme: ThemeState}) {
    const {endpoint} = useParams<"endpoint">()
    return <AnalyticsPage theme={props.theme} endpoint={endpoint!}/>
}


export interface TimeRange {
    startDay: Dayjs
    endDay: Dayjs
}

declare module '@emotion/react' {
    // export interface Theme extends MaterialUiTheme {
    //
    // }
}