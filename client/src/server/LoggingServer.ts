export namespace LoggingServer {
    export async function getEndpoints(): Promise<string[]>{
        return ["getCrash","uploadCrash","scheduleTasks"]
    }

    //TODO: day-dependenat
    export async function getLogs(endpoint: string): Promise<string> {
        switch (endpoint){
            case "getCrash" :
                return getCrash
            case "uploadCrash" :
                return uploadCrash
            default:
                return uploadCrash
        }
    }
}

const scheduleTasks = `[
{"name":"scheduleTasks","startTime":1676558493257,"endTime":1676558494381,"logs":[{"type":"DetailLog","key":"Schedule Time","value":"2023-02-16T14:41:33.257978200Z"},{"type":"MessageLog","message":"Evicting crashes from days: [14/1/2023]","time":1676558493265,"severity":"Info"},{"type":"MessageLog","message":"Evicting 1 crashes from 14/1/2023.","time":1676558493267,"severity":"Info"},{"type":"MessageLog","message":"Archived 933e676e-3c42-45bf-b794-c8de5bdcd054 to S3.","time":1676558494379,"severity":"Info"}]}
]`

const uploadCrash = `[
{"name":"/uploadCrash","startTime":1676558596254,"endTime":1676558596296,"logs":[{"type":"DetailLog","key":"GZip Compressed","value":"true"},{"type":"DetailLog","key":"Accepted size","value":"23869"},{"type":"DetailLog","key":"Generated ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Deletion Key","value":"88Ll89"}]}
]`

//TODO: 2 crashes on each, getCrash have a speperate one for each day
const getCrash = `[
{"name":"/{id}/raw.txt","startTime":1676558596314,"endTime":1676558596340,"logs":[{"type":"DetailLog","key":"ID","value":"df0864af-32f8-4910-9666-a1639b43942d"},{"type":"DetailLog","key":"Response","value":"class io.github.crashy.crashlogs.api.GetCrashResponse$Success"}]}
]`
//
// const getCrash = `[{
//     "name": "getCrash",
//     "startTime": 1674225696143,
//     "endTime": 1674225696146,
//     "logs": [
//         {
//             "type": "DetailLog",
//             "key": "Schedule Time",
//             "value": "2023-01-20T14:41:36.143300500Z"
//         },
//         {
//             "type": "DetailLog",
//             "key": "Foo",
//             "value": "Bar"
//         },
//         {
//             "type": "MessageLog",
//             "message": "Halo Info",
//             "time": 1674225696143,
//             "severity": "Info"
//         },
//         {
//             "type": "MessageLog",
//             "message": "Halo Warn",
//             "time": 1674225696144,
//             "severity": "Warn"
//         },
//         {
//             "type": "ErrorLog",
//             "message": "Halo Error",
//             "time": 1674225696144,
//             "severity": "Error",
//             "exception": {
//                 "className": "java.lang.NullPointerException",
//                 "message": "",
//                 "stacktrace": "java.lang.NullPointerException\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:86)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
//             }
//         },
//         {
//             "type": "ErrorLog",
//             "message": "Unexpected error handling 'scheduleTasks'",
//             "time": 1674225696145,
//             "severity": "Error",
//             "exception": {
//                 "className": "java.lang.IllegalArgumentException",
//                 "message": "Fuck jhew",
//                 "stacktrace": "java.lang.IllegalArgumentException: Fuck jhew\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:87)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
//             }
//         }
//     ]
// },{
//     "name": "getCrash",
//     "startTime": 1674209722013,
//     "endTime": 1674209722018,
//     "logs": [
//         {
//             "type": "DetailLog",
//             "key": "Schedule Time",
//             "value": "2023-01-20T10:15:22.013751300Z"
//         },
//         {
//             "type": "MessageLog",
//             "message": "Evicting crashes from days: []",
//             "time": 1674209722016,
//             "severity": "Info"
//         }
//     ]
// }]
// `
//
// const uploadCrash = `[{
//     "name": "uploadCrash",
//     "startTime": 1674225696143,
//     "endTime": 1674225696146,
//     "logs": [
//         {
//             "type": "DetailLog",
//             "key": "Schedule Time",
//             "value": "2023-01-20T14:41:36.143300500Z"
//         },
//         {
//             "type": "DetailLog",
//             "key": "Foo",
//             "value": "Bar"
//         },
//         {
//             "type": "MessageLog",
//             "message": "Halo Info",
//             "time": 1674225696143,
//             "severity": "Info"
//         },
//         {
//             "type": "MessageLog",
//             "message": "Halo Warn",
//             "time": 1674225696144,
//             "severity": "Warn"
//         },
//         {
//             "type": "ErrorLog",
//             "message": "Halo Error",
//             "time": 1674225696144,
//             "severity": "Error",
//             "exception": {
//                 "className": "java.lang.NullPointerException",
//                 "message": "",
//                 "stacktrace": "java.lang.NullPointerException\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:86)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
//             }
//         },
//         {
//             "type": "ErrorLog",
//             "message": "Unexpected error handling 'scheduleTasks'",
//             "time": 1674225696145,
//             "severity": "Error",
//             "exception": {
//                 "className": "java.lang.IllegalArgumentException",
//                 "message": "Fuck jhew",
//                 "stacktrace": "java.lang.IllegalArgumentException: Fuck jhew\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:87)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
//             }
//         }
//     ]
// }]
// `