package natanfudge.io.logs;

import java.lang.System;

@kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000B\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010!\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0003\n\u0002\b\u0004\u0018\u00002\u00020\u0001B\u0015\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0006\u0010\u000e\u001a\u00020\u000fJ\"\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u00032\f\u0010\u0013\u001a\b\u0012\u0004\u0012\u00020\u00010\u0014H\u0086\b\u00f8\u0001\u0000J\"\u0010\u0015\u001a\u00020\u00112\u0006\u0010\u0016\u001a\u00020\u00172\f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00030\u0014H\u0086\b\u00f8\u0001\u0000J\u001a\u0010\u0019\u001a\u00020\u00112\f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00030\u0014H\u0086\b\u00f8\u0001\u0000J\u001a\u0010\u001a\u001a\u00020\u00112\f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00030\u0014H\u0086\b\u00f8\u0001\u0000R\u001d\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\b\u00a2\u0006\u000e\n\u0000\u0012\u0004\b\n\u0010\u000b\u001a\u0004\b\f\u0010\rR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u0082\u0002\u0007\n\u0005\b\u009920\u0001\u00a8\u0006\u001b"}, d2 = {"Lnatanfudge/io/logs/LogContext;", "", "name", "", "startTime", "Ljava/time/Instant;", "(Ljava/lang/String;Ljava/time/Instant;)V", "___logDetails", "", "Lnatanfudge/io/logs/LogLine;", "get___logDetails$annotations", "()V", "get___logDetails", "()Ljava/util/List;", "buildLog", "Lnatanfudge/io/logs/LogEvent;", "logData", "", "key", "value", "Lkotlin/Function0;", "logError", "exception", "", "message", "logInfo", "logWarn", "LogViewer"})
public final class LogContext {
    private final java.lang.String name = null;
    private final java.time.Instant startTime = null;
    @org.jetbrains.annotations.NotNull
    private final java.util.List<natanfudge.io.logs.LogLine> ___logDetails = null;
    
    public LogContext(@org.jetbrains.annotations.NotNull
    java.lang.String name, @org.jetbrains.annotations.NotNull
    java.time.Instant startTime) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.util.List<natanfudge.io.logs.LogLine> get___logDetails() {
        return null;
    }
    
    @kotlin.Suppress(names = {"PropertyName"})
    @java.lang.Deprecated
    public static void get___logDetails$annotations() {
    }
    
    public final void logInfo(@org.jetbrains.annotations.NotNull
    kotlin.jvm.functions.Function0<java.lang.String> message) {
    }
    
    public final void logWarn(@org.jetbrains.annotations.NotNull
    kotlin.jvm.functions.Function0<java.lang.String> message) {
    }
    
    public final void logError(@org.jetbrains.annotations.NotNull
    java.lang.Throwable exception, @org.jetbrains.annotations.NotNull
    kotlin.jvm.functions.Function0<java.lang.String> message) {
    }
    
    public final void logData(@org.jetbrains.annotations.NotNull
    java.lang.String key, @org.jetbrains.annotations.NotNull
    kotlin.jvm.functions.Function0<? extends java.lang.Object> value) {
    }
    
    @org.jetbrains.annotations.NotNull
    public final natanfudge.io.logs.LogEvent buildLog() {
        return null;
    }
}