import React, {useState} from 'react'
import {createTheme, CssBaseline, styled, Theme, ThemeOptions, ThemeProvider} from "@mui/material";
import "../extensions/ExtensionsImpl"
import "fudge-lib/dist/extensions/Extensions"
import "fudge-lib/dist/extensions/ExtensionsImpl"
import "../utils-proposals/extensions/ExtensionsImpl"
import {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BrowserRouter, Route, Routes, useParams} from "react-router-dom";
import {AnalyticsPage} from "./AnalyticsPage";
import {Logs} from "./Logs";
import {SearchitBar} from "./searchit/SearchitBar";
import { Theme as MUITheme, ThemeOptions as MUIThemeOptions } from '@mui/material/styles';

// import { PaletteOptions } from "@mui/material/styles/createPalette";
//
// declare module "@mui/material/styles/createPalette" {
//     export interface PaletteOptions {
//         secondaryBackground: string
//     }
// }

//TODO: I need a rendering limit for very very large logs.

export function AppWrapper() {
    // return <Test>
    //     <div>Child 1</div>
    //     <div>Child 2</div>
    //     <div>Child 3</div>
    //     <div>Child 4</div>
    //     <div>Child 5</div>
    //     <div>Child 6</div>
    // </Test>
    // return <MegaSearchBar/>
    const [isDark, setIsDark] = useState<boolean>(true)
    //TODO: use system theme preferences
    const darkTheme = createTheme({
        custom: {
            secondaryBackground: "rgb(65,64,64)",
            secondaryBackgroundBorder: "rgb(103,103,103)",
            secondaryBackgroundSeparator: "rgb(148,148,148)",
            selectedCompletionBackground: "rgb(73,84,119)"
        },
        palette: {
            mode: isDark ? 'dark' : "light"
        },
    });


    return <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline/>
            <BrowserRouter>
                {/*<LoggySearchBarTest/>*/}
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
        <Route path="/logs/" element={<Logs key = {undefined} theme={props.theme} endpoint={undefined}/>}/>
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
    return <Page Content={({endpoint}) => <Logs key = {endpoint} theme={props.theme} endpoint={endpoint}/>}/>
}

function RoutedAnalytics(props: {theme: ThemeState}) {
    const {endpoint} = useParams<"endpoint">()
    return <AnalyticsPage theme={props.theme} endpoint={endpoint!}/>
}


export interface TimeRange {
    startDay: Dayjs
    endDay: Dayjs
}

type CustomTheme = {
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
        custom?: CustomTheme
    }
}