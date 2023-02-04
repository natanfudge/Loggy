package natanfudge.io.logs;

import java.lang.System;

@kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0006\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J8\u0010\u0007\u001a\u0002H\b\"\u0004\b\u0000\u0010\b2\u0006\u0010\t\u001a\u00020\n2\u0017\u0010\u000b\u001a\u0013\u0012\u0004\u0012\u00020\r\u0012\u0004\u0012\u0002H\b0\f\u00a2\u0006\u0002\b\u000eH\u0086\b\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u000fJ3\u0010\u0010\u001a\u0002H\b\"\u0004\b\u0000\u0010\b2\u0006\u0010\t\u001a\u00020\n2\u0012\u0010\u000b\u001a\u000e\u0012\u0004\u0012\u00020\r\u0012\u0004\u0012\u0002H\b0\fH\u0086\b\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u000fR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0005\u0010\u0006\u0082\u0002\u0007\n\u0005\b\u009920\u0001\u00a8\u0006\u0011"}, d2 = {"Lnatanfudge/io/logs/FancyLogger;", "", "logToConsole", "", "(Z)V", "getLogToConsole", "()Z", "startCall", "T", "name", "", "call", "Lkotlin/Function1;", "Lnatanfudge/io/logs/LogContext;", "Lkotlin/ExtensionFunctionType;", "(Ljava/lang/String;Lkotlin/jvm/functions/Function1;)Ljava/lang/Object;", "startCallWithContextAsParam", "LogViewer"})
public final class FancyLogger {
    private final boolean logToConsole = false;
    
    public FancyLogger(boolean logToConsole) {
        super();
    }
    
    public final boolean getLogToConsole() {
        return false;
    }
    
    public final <T extends java.lang.Object>T startCall(@org.jetbrains.annotations.NotNull
    java.lang.String name, @org.jetbrains.annotations.NotNull
    kotlin.jvm.functions.Function1<? super natanfudge.io.logs.LogContext, ? extends T> call) {
        return null;
    }
    
    public final <T extends java.lang.Object>T startCallWithContextAsParam(@org.jetbrains.annotations.NotNull
    java.lang.String name, @org.jetbrains.annotations.NotNull
    kotlin.jvm.functions.Function1<? super natanfudge.io.logs.LogContext, ? extends T> call) {
        return null;
    }
}