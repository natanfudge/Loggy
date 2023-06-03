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
import {MegaSearchBar, MegaSearchBarTest} from "./search/MegaSearchBar";
import { Theme as MUITheme, ThemeOptions as MUIThemeOptions } from '@mui/material/styles';

// import { PaletteOptions } from "@mui/material/styles/createPalette";
//
// declare module "@mui/material/styles/createPalette" {
//     export interface PaletteOptions {
//         secondaryBackground: string
//     }
// }

//TODO: I need a rendering limit for very very large logs.

//TODO: very poorly displaying logs:

`[
  {
    "name": "scheduleTasks",
    "startTime": 1684245621366,
    "endTime": 1684245621442,
    "logs": [
      {
        "type": "DetailLog",
        "key": "Crashy Home Dir",
        "value": "/root/.crashy"
      },
      {
        "type": "DetailLog",
        "key": "Schedule Time",
        "value": "2023-05-16T14:00:21.366850947Z"
      },
      {
        "type": "MessageLog",
        "message": "Evicting crashes from days: [7/1/2023, 11/1/2023, 13/1/2023, 15/1/2023, 16/1/2023, 21/1/2023, 29/1/2023, 2/2/2023, 3/2/2023, 4/2/2023, 5/2/2023, 6/2/2023, 7/2/2023, 8/2/2023, 9/2/2023, 10/2/2023, 11/2/2023, 12/2/2023, 13/2/2023, 14/2/2023, 15/2/2023, 16/2/2023, 17/2/2023, 18/2/2023, 19/2/2023, 20/2/2023, 21/2/2023, 22/2/2023, 23/2/2023, 24/2/2023, 25/2/2023, 26/2/2023, 27/2/2023, 28/2/2023, 1/3/2023, 2/3/2023, 3/3/2023, 4/3/2023, 5/3/2023, 6/3/2023, 7/3/2023, 8/3/2023, 9/3/2023, 10/3/2023, 11/3/2023, 12/3/2023, 13/3/2023, 14/3/2023, 15/3/2023, 16/3/2023, 17/3/2023, 18/3/2023, 19/3/2023, 20/3/2023, 21/3/2023, 22/3/2023, 23/3/2023, 24/3/2023, 25/3/2023, 26/3/2023, 27/3/2023, 28/3/2023, 29/3/2023, 30/3/2023, 31/3/2023, 1/4/2023, 2/4/2023, 3/4/2023, 4/4/2023, 5/4/2023, 6/4/2023, 7/4/2023, 8/4/2023, 9/4/2023, 10/4/2023, 11/4/2023, 12/4/2023, 13/4/2023, 14/4/2023, 15/4/2023, 16/4/2023]",
        "time": 1684245621400,
        "severity": "Info"
      },
      {
        "type": "MessageLog",
        "message": "Evicting 56 crashes from 7/1/2023.",
        "time": 1684245621422,
        "severity": "Info"
      },
      {
        "type": "ErrorLog",
        "message": "Unexpected error handling 'scheduleTasks'",
        "time": 1684245621424,
        "exception": [
          {
            "className": "java.nio.file.NoSuchFileException",
            "message": "/root/.crashy/cache/crashlogs/d2e7c827-1fce-408b-ab0d-5fddcbbd664f/crash.br",
            "stacktrace": "java.nio.file.NoSuchFileException: /root/.crashy/cache/crashlogs/d2e7c827-1fce-408b-ab0d-5fddcbbd664f/crash.br\\n\\tat java.base/sun.nio.fs.UnixException.translateToIOException(UnixException.java:92)\\n\\tat java.base/sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:106)\\n\\tat java.base/sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:111)\\n\\tat java.base/sun.nio.fs.UnixFileSystemProvider.newByteChannel(UnixFileSystemProvider.java:218)\\n\\tat java.base/java.nio.file.Files.newByteChannel(Files.java:380)\\n\\tat java.base/java.nio.file.Files.newByteChannel(Files.java:432)\\n\\tat java.base/java.nio.file.Files.readAllBytes(Files.java:3288)\\n\\tat io.github.crashy.crashlogs.CompressedLog$Companion.readFromFile-W09D3f0(Models.kt:86)\\n\\tat io.github.crashy.crashlogs.storage.CrashlogCache.fromCrashesDir-40a7EH0(CrashlogCache.kt:143)\\n\\tat io.github.crashy.crashlogs.storage.CrashlogCache.evictOld(CrashlogCache.kt:85)\\n\\tat io.github.crashy.crashlogs.storage.CrashlogStorage.evictOld(CrashlogStorage.kt:121)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1$1.invokeSuspend(Routing.kt:55)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1$1.invoke(Routing.kt)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1$1.invoke(Routing.kt)\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startSuspend(FancyLogger.kt:118)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:52)\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\n"
          }
        ],
        "severity": "Error"
      }
    ]
  },
  {
    "name": "scheduleTasks",
    "startTime": 1684245250908,
    "endTime": 1684245250982,
    "logs": [
      {
        "type": "DetailLog",
        "key": "Crashy Home Dir",
        "value": "/root/.crashy"
      },
      {
        "type": "DetailLog",
        "key": "Schedule Time",
        "value": "2023-05-16T13:54:10.908915976Z"
      },
      {
        "type": "MessageLog",
        "message": "Evicting crashes from days: [7/1/2023, 11/1/2023, 13/1/2023, 15/1/2023, 16/1/2023, 21/1/2023, 29/1/2023, 2/2/2023, 3/2/2023, 4/2/2023, 5/2/2023, 6/2/2023, 7/2/2023, 8/2/2023, 9/2/2023, 10/2/2023, 11/2/2023, 12/2/2023, 13/2/2023, 14/2/2023, 15/2/2023, 16/2/2023, 17/2/2023, 18/2/2023, 19/2/2023, 20/2/2023, 21/2/2023, 22/2/2023, 23/2/2023, 24/2/2023, 25/2/2023, 26/2/2023, 27/2/2023, 28/2/2023, 1/3/2023, 2/3/2023, 3/3/2023, 4/3/2023, 5/3/2023, 6/3/2023, 7/3/2023, 8/3/2023, 9/3/2023, 10/3/2023, 11/3/2023, 12/3/2023, 13/3/2023, 14/3/2023, 15/3/2023, 16/3/2023, 17/3/2023, 18/3/2023, 19/3/2023, 20/3/2023, 21/3/2023, 22/3/2023, 23/3/2023, 24/3/2023, 25/3/2023, 26/3/2023, 27/3/2023, 28/3/2023, 29/3/2023, 30/3/2023, 31/3/2023, 1/4/2023, 2/4/2023, 3/4/2023, 4/4/2023, 5/4/2023, 6/4/2023, 7/4/2023, 8/4/2023, 9/4/2023, 10/4/2023, 11/4/2023, 12/4/2023, 13/4/2023, 14/4/2023, 15/4/2023, 16/4/2023]",
        "time": 1684245250945,
        "severity": "Info"
      },
      {
        "type": "MessageLog",
        "message": "Evicting 56 crashes from 7/1/2023.",
        "time": 1684245250961,
        "severity": "Info"
      },
      {
        "type": "ErrorLog",
        "message": "Unexpected error handling 'scheduleTasks'",
        "time": 1684245250967,
        "exception": [
          {
            "className": "java.nio.file.NoSuchFileException",
            "message": "/root/.crashy/cache/crashlogs/d2e7c827-1fce-408b-ab0d-5fddcbbd664f/crash.br",
            "stacktrace": "java.nio.file.NoSuchFileException: /root/.crashy/cache/crashlogs/d2e7c827-1fce-408b-ab0d-5fddcbbd664f/crash.br\\n\\tat java.base/sun.nio.fs.UnixException.translateToIOException(UnixException.java:92)\\n\\tat java.base/sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:106)\\n\\tat java.base/sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:111)\\n\\tat java.base/sun.nio.fs.UnixFileSystemProvider.newByteChannel(UnixFileSystemProvider.java:218)\\n\\tat java.base/java.nio.file.Files.newByteChannel(Files.java:380)\\n\\tat java.base/java.nio.file.Files.newByteChannel(Files.java:432)\\n\\tat java.base/java.nio.file.Files.readAllBytes(Files.java:3288)\\n\\tat io.github.crashy.crashlogs.CompressedLog$Companion.readFromFile-W09D3f0(Models.kt:86)\\n\\tat io.github.crashy.crashlogs.storage.CrashlogCache.fromCrashesDir-40a7EH0(CrashlogCache.kt:143)\\n\\tat io.github.crashy.crashlogs.storage.CrashlogCache.evictOld(CrashlogCache.kt:85)\\n\\tat io.github.crashy.crashlogs.storage.CrashlogStorage.evictOld(CrashlogStorage.kt:121)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1$1.invokeSuspend(Routing.kt:55)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1$1.invoke(Routing.kt)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1$1.invoke(Routing.kt)\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startSuspend(FancyLogger.kt:118)\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:52)\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\n"
          }
        ],
        "severity": "Error"
      }
    ]
  }
]`



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
    //TODO: set body data-theme="dark"/"light" for search bar
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
                <MegaSearchBarTest/>
                {/*{analytics !== undefined && <AnalyticsGraph analytics={analytics}/>}*/}
                {/*<RoutedApp theme={{setThemeDark: setIsDark, isDark}}/>*/}
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