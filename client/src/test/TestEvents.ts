// language=JSON
export const testLogResponse = `{
  "pageCount": 1,
  "logs": [
    {
      "name": "amar",
      "startTime": 1683974074000,
      "endTime": 1683975084000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Verbose Test",
          "time": 1683975074000,
          "severity": "Verbose"
        },
        {
          "type": "MessageLog",
          "message": "Debug Test",
          "time": 1683975074000,
          "severity": "Debug"
        },
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683975074000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683975074000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683975074000,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683975074000,
      "endTime": 1683975074000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683975074000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683975074000,
          "severity": "Warn"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683974133000,
      "endTime": 1683974133000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683974133,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683974133000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683974133000,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683973690000,
      "endTime": 1683973690000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973690000,
          "severity": "Info"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683973662000,
      "endTime": 1683973662000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973662000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683973662000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683996662000,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    },
    {
      "name": "amar",
      "startTime": 1683973662000,
      "endTime": 1683973662000,
      "logs": [
        {
          "type": "MessageLog",
          "message": "Info Test",
          "time": 1683973662000,
          "severity": "Info"
        },
        {
          "type": "MessageLog",
          "message": "Warn Test",
          "time": 1683973662000,
          "severity": "Warn"
        },
        {
          "type": "ErrorLog",
          "message": "Error Test",
          "time": 1683996662000,
          "exception": [
            {
              "className": "java.lang.NullPointerException",
              "message": "",
              "stacktrace": "java.lang.NullPointerException\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:43)\\r\\n\\tat test.TestAppKt$module$1.invoke(TestApp.kt:40)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCallWithContextAsParam(FancyLogger.kt:102)\\r\\n\\tat io.github.natanfudge.logs.impl.FancyLogger.startCall(FancyLogger.kt:94)\\r\\n\\tat test.TestAppKt.module(TestApp.kt:40)\\r\\n\\tat test.TestAppKt.access$module(TestApp.kt:1)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat test.TestAppKt$main$1.invoke(TestApp.kt:20)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:320)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading$instantiateAndConfigureApplication$1.invoke(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.avoidingDoubleStartup(ApplicationEngineEnvironmentReloading.kt:337)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.instantiateAndConfigureApplication(ApplicationEngineEnvironmentReloading.kt:309)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.createApplication(ApplicationEngineEnvironmentReloading.kt:150)\\r\\n\\tat io.ktor.server.engine.ApplicationEngineEnvironmentReloading.start(ApplicationEngineEnvironmentReloading.kt:276)\\r\\n\\tat io.ktor.server.netty.NettyApplicationEngine.start(NettyApplicationEngine.kt:216)\\r\\n\\tat test.TestAppKt.main(TestApp.kt:23)\\r\\n\\tat test.TestAppKt.main(TestApp.kt)\\r\\n"
            }
          ],
          "severity": "Error"
        },
        {
          "type": "DetailLog",
          "key": "Foo",
          "value": "Bar"
        },
        {
          "type": "DetailLog",
          "key": "Biz",
          "value": "Baz"
        }
      ]
    }
  ]
}`


// language=JSON
export const badAppearanceTestLog = `{
  "pageCount": 1,
  "logs": [
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
  ]
}`