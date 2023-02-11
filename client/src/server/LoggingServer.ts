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

const getCrash = `[{
    "name": "getCrash",
    "startTime": 1674225696143,
    "endTime": 1674225696146,
    "logs": [
        {
            "type": "DetailLog",
            "key": "Schedule Time",
            "value": "2023-01-20T14:41:36.143300500Z"
        },
        {
            "type": "DetailLog",
            "key": "Foo",
            "value": "Bar"
        },
        {
            "type": "MessageLog",
            "message": "Halo Info",
            "time": 1674225696143,
            "severity": "Info"
        },
        {
            "type": "MessageLog",
            "message": "Halo Warn",
            "time": 1674225696144,
            "severity": "Warn"
        },
        {
            "type": "ErrorLog",
            "message": "Halo Error",
            "time": 1674225696144,
            "severity": "Error",
            "exception": {
                "className": "java.lang.NullPointerException",
                "message": "",
                "stacktrace": "java.lang.NullPointerException\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:86)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
            }
        },
        {
            "type": "ErrorLog",
            "message": "Unexpected error handling 'scheduleTasks'",
            "time": 1674225696145,
            "severity": "Error",
            "exception": {
                "className": "java.lang.IllegalArgumentException",
                "message": "Fuck jhew",
                "stacktrace": "java.lang.IllegalArgumentException: Fuck jhew\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:87)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
            }
        }
    ]
},{
    "name": "getCrash",
    "startTime": 1674209722013,
    "endTime": 1674209722018,
    "logs": [
        {
            "type": "DetailLog",
            "key": "Schedule Time",
            "value": "2023-01-20T10:15:22.013751300Z"
        },
        {
            "type": "MessageLog",
            "message": "Evicting crashes from days: []",
            "time": 1674209722016,
            "severity": "Info"
        }
    ]
}]
`

const uploadCrash = `[{
    "name": "uploadCrash",
    "startTime": 1674225696143,
    "endTime": 1674225696146,
    "logs": [
        {
            "type": "DetailLog",
            "key": "Schedule Time",
            "value": "2023-01-20T14:41:36.143300500Z"
        },
        {
            "type": "DetailLog",
            "key": "Foo",
            "value": "Bar"
        },
        {
            "type": "MessageLog",
            "message": "Halo Info",
            "time": 1674225696143,
            "severity": "Info"
        },
        {
            "type": "MessageLog",
            "message": "Halo Warn",
            "time": 1674225696144,
            "severity": "Warn"
        },
        {
            "type": "ErrorLog",
            "message": "Halo Error",
            "time": 1674225696144,
            "severity": "Error",
            "exception": {
                "className": "java.lang.NullPointerException",
                "message": "",
                "stacktrace": "java.lang.NullPointerException\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:86)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
            }
        },
        {
            "type": "ErrorLog",
            "message": "Unexpected error handling 'scheduleTasks'",
            "time": 1674225696145,
            "severity": "Error",
            "exception": {
                "className": "java.lang.IllegalArgumentException",
                "message": "Fuck jhew",
                "stacktrace": "java.lang.IllegalArgumentException: Fuck jhew\\r\\n\\tat io.github.crashy.routing.RoutingKt$scheduleTasks$1$1.invokeSuspend(Routing.kt:87)\\r\\n\\tat kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)\\r\\n\\tat kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)\\r\\n\\tat kotlinx.coroutines.internal.LimitedDispatcher.run(LimitedDispatcher.kt:42)\\r\\n\\tat kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:95)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:570)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:750)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:677)\\r\\n\\tat kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:664)\\r\\n"
            }
        }
    ]
}]
`