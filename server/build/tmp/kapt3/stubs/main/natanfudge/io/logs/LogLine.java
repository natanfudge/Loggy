package natanfudge.io.logs;

import java.lang.System;

@kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\bw\u0018\u0000 \u00022\u00020\u0001:\u0004\u0002\u0003\u0004\u0005\u0082\u0001\u0002\u0006\u0007\u00a8\u0006\b"}, d2 = {"Lnatanfudge/io/logs/LogLine;", "", "Companion", "Detail", "Message", "Severity", "Lnatanfudge/io/logs/LogLine$Detail;", "Lnatanfudge/io/logs/LogLine$Message;", "LogViewer"})
@kotlinx.serialization.Serializable
public abstract interface LogLine {
    @org.jetbrains.annotations.NotNull
    public static final natanfudge.io.logs.LogLine.Companion Companion = null;
    
    @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000,\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\bw\u0018\u0000 \u000e2\u00020\u0001:\u0003\u000e\u000f\u0010R\u0012\u0010\u0002\u001a\u00020\u0003X\u00a6\u0004\u00a2\u0006\u0006\u001a\u0004\b\u0004\u0010\u0005R\u0012\u0010\u0006\u001a\u00020\u0007X\u00a6\u0004\u00a2\u0006\u0006\u001a\u0004\b\b\u0010\tR\u0012\u0010\n\u001a\u00020\u000bX\u00a6\u0004\u00a2\u0006\u0006\u001a\u0004\b\f\u0010\r\u0082\u0001\u0002\u0011\u0012\u00a8\u0006\u0013"}, d2 = {"Lnatanfudge/io/logs/LogLine$Message;", "Lnatanfudge/io/logs/LogLine;", "message", "", "getMessage", "()Ljava/lang/String;", "severity", "Lnatanfudge/io/logs/LogLine$Severity;", "getSeverity", "()Lnatanfudge/io/logs/LogLine$Severity;", "time", "Ljava/time/Instant;", "getTime", "()Ljava/time/Instant;", "Companion", "Error", "Normal", "Lnatanfudge/io/logs/LogLine$Message$Error;", "Lnatanfudge/io/logs/LogLine$Message$Normal;", "LogViewer"})
    @kotlinx.serialization.Serializable
    public static abstract interface Message extends natanfudge.io.logs.LogLine {
        @org.jetbrains.annotations.NotNull
        public static final natanfudge.io.logs.LogLine.Message.Companion Companion = null;
        
        @org.jetbrains.annotations.NotNull
        public abstract java.lang.String getMessage();
        
        @org.jetbrains.annotations.NotNull
        public abstract java.time.Instant getTime();
        
        @org.jetbrains.annotations.NotNull
        public abstract natanfudge.io.logs.LogLine.Severity getSeverity();
        
        @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000N\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\r\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0087\b\u0018\u0000 &2\u00020\u0001:\u0002%&B7\b\u0017\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\b\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u0012\b\u0010\b\u001a\u0004\u0018\u00010\t\u0012\b\u0010\n\u001a\u0004\u0018\u00010\u000b\u00a2\u0006\u0002\u0010\fB\u001d\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u0012\u0006\u0010\b\u001a\u00020\t\u00a2\u0006\u0002\u0010\rJ\t\u0010\u0014\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u0015\u001a\u00020\u0007H\u00c6\u0003J\t\u0010\u0016\u001a\u00020\tH\u00c6\u0003J\'\u0010\u0017\u001a\u00020\u00002\b\b\u0002\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\tH\u00c6\u0001J\u0013\u0010\u0018\u001a\u00020\u00192\b\u0010\u001a\u001a\u0004\u0018\u00010\u001bH\u00d6\u0003J\t\u0010\u001c\u001a\u00020\u0003H\u00d6\u0001J\t\u0010\u001d\u001a\u00020\u0005H\u00d6\u0001J!\u0010\u001e\u001a\u00020\u001f2\u0006\u0010 \u001a\u00020\u00002\u0006\u0010!\u001a\u00020\"2\u0006\u0010#\u001a\u00020$H\u00c7\u0001R\u0014\u0010\u0004\u001a\u00020\u0005X\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000fR\u0014\u0010\b\u001a\u00020\tX\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0014\u0010\u0006\u001a\u00020\u0007X\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013\u00a8\u0006\'"}, d2 = {"Lnatanfudge/io/logs/LogLine$Message$Normal;", "Lnatanfudge/io/logs/LogLine$Message;", "seen1", "", "message", "", "time", "Ljava/time/Instant;", "severity", "Lnatanfudge/io/logs/LogLine$Severity;", "serializationConstructorMarker", "Lkotlinx/serialization/internal/SerializationConstructorMarker;", "(ILjava/lang/String;Ljava/time/Instant;Lnatanfudge/io/logs/LogLine$Severity;Lkotlinx/serialization/internal/SerializationConstructorMarker;)V", "(Ljava/lang/String;Ljava/time/Instant;Lnatanfudge/io/logs/LogLine$Severity;)V", "getMessage", "()Ljava/lang/String;", "getSeverity", "()Lnatanfudge/io/logs/LogLine$Severity;", "getTime", "()Ljava/time/Instant;", "component1", "component2", "component3", "copy", "equals", "", "other", "", "hashCode", "toString", "write$Self", "", "self", "output", "Lkotlinx/serialization/encoding/CompositeEncoder;", "serialDesc", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "$serializer", "Companion", "LogViewer"})
        @kotlinx.serialization.SerialName(value = "MessageLog")
        @kotlinx.serialization.Serializable
        public static final class Normal implements natanfudge.io.logs.LogLine.Message {
            @org.jetbrains.annotations.NotNull
            public static final natanfudge.io.logs.LogLine.Message.Normal.Companion Companion = null;
            @org.jetbrains.annotations.NotNull
            private final java.lang.String message = null;
            @org.jetbrains.annotations.NotNull
            private final java.time.Instant time = null;
            @org.jetbrains.annotations.NotNull
            private final natanfudge.io.logs.LogLine.Severity severity = null;
            
            @org.jetbrains.annotations.NotNull
            public final natanfudge.io.logs.LogLine.Message.Normal copy(@org.jetbrains.annotations.NotNull
            java.lang.String message, @org.jetbrains.annotations.NotNull
            java.time.Instant time, @org.jetbrains.annotations.NotNull
            natanfudge.io.logs.LogLine.Severity severity) {
                return null;
            }
            
            @java.lang.Override
            public boolean equals(@org.jetbrains.annotations.Nullable
            java.lang.Object other) {
                return false;
            }
            
            @java.lang.Override
            public int hashCode() {
                return 0;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public java.lang.String toString() {
                return null;
            }
            
            @kotlin.jvm.JvmStatic
            public static final void write$Self(@org.jetbrains.annotations.NotNull
            natanfudge.io.logs.LogLine.Message.Normal self, @org.jetbrains.annotations.NotNull
            kotlinx.serialization.encoding.CompositeEncoder output, @org.jetbrains.annotations.NotNull
            kotlinx.serialization.descriptors.SerialDescriptor serialDesc) {
            }
            
            public Normal(@org.jetbrains.annotations.NotNull
            java.lang.String message, @org.jetbrains.annotations.NotNull
            java.time.Instant time, @org.jetbrains.annotations.NotNull
            natanfudge.io.logs.LogLine.Severity severity) {
                super();
            }
            
            @org.jetbrains.annotations.NotNull
            public final java.lang.String component1() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public java.lang.String getMessage() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            public final java.time.Instant component2() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public java.time.Instant getTime() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            public final natanfudge.io.logs.LogLine.Severity component3() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public natanfudge.io.logs.LogLine.Severity getSeverity() {
                return null;
            }
            
            @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004H\u00c6\u0001\u00a8\u0006\u0006"}, d2 = {"Lnatanfudge/io/logs/LogLine$Message$Normal$Companion;", "", "()V", "serializer", "Lkotlinx/serialization/KSerializer;", "Lnatanfudge/io/logs/LogLine$Message$Normal;", "LogViewer"})
            public static final class Companion {
                
                private Companion() {
                    super();
                }
                
                @org.jetbrains.annotations.NotNull
                public final kotlinx.serialization.KSerializer<natanfudge.io.logs.LogLine.Message.Normal> serializer() {
                    return null;
                }
            }
            
            @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u00006\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0011\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c7\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0003J\u0018\u0010\b\u001a\f\u0012\b\u0012\u0006\u0012\u0002\b\u00030\n0\tH\u00d6\u0001\u00a2\u0006\u0002\u0010\u000bJ\u0011\u0010\f\u001a\u00020\u00022\u0006\u0010\r\u001a\u00020\u000eH\u00d6\u0001J\u0019\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\u00122\u0006\u0010\u0013\u001a\u00020\u0002H\u00d6\u0001R\u0014\u0010\u0004\u001a\u00020\u00058VX\u00d6\u0005\u00a2\u0006\u0006\u001a\u0004\b\u0006\u0010\u0007\u00a8\u0006\u0014"}, d2 = {"natanfudge/io/logs/LogLine.Message.Normal.$serializer", "Lkotlinx/serialization/internal/GeneratedSerializer;", "Lnatanfudge/io/logs/LogLine$Message$Normal;", "()V", "descriptor", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "getDescriptor", "()Lkotlinx/serialization/descriptors/SerialDescriptor;", "childSerializers", "", "Lkotlinx/serialization/KSerializer;", "()[Lkotlinx/serialization/KSerializer;", "deserialize", "decoder", "Lkotlinx/serialization/encoding/Decoder;", "serialize", "", "encoder", "Lkotlinx/serialization/encoding/Encoder;", "value", "LogViewer"})
            @java.lang.Deprecated
            public static final class $serializer implements kotlinx.serialization.internal.GeneratedSerializer<natanfudge.io.logs.LogLine.Message.Normal> {
                @org.jetbrains.annotations.NotNull
                public static final natanfudge.io.logs.LogLine.Message.Normal.$serializer INSTANCE = null;
                
                private $serializer() {
                    super();
                }
                
                @org.jetbrains.annotations.NotNull
                @java.lang.Override
                public kotlinx.serialization.KSerializer<?>[] childSerializers() {
                    return null;
                }
                
                @org.jetbrains.annotations.NotNull
                @java.lang.Override
                public natanfudge.io.logs.LogLine.Message.Normal deserialize(@org.jetbrains.annotations.NotNull
                kotlinx.serialization.encoding.Decoder decoder) {
                    return null;
                }
                
                @org.jetbrains.annotations.NotNull
                @java.lang.Override
                public kotlinx.serialization.descriptors.SerialDescriptor getDescriptor() {
                    return null;
                }
                
                @java.lang.Override
                public void serialize(@org.jetbrains.annotations.NotNull
                kotlinx.serialization.encoding.Encoder encoder, @org.jetbrains.annotations.NotNull
                natanfudge.io.logs.LogLine.Message.Normal value) {
                }
                
                @org.jetbrains.annotations.NotNull
                public kotlinx.serialization.KSerializer<?>[] typeParametersSerializers() {
                    return null;
                }
            }
        }
        
        @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000T\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0003\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u000f\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0087\b\u0018\u0000 *2\u00020\u0001:\u0002)*BA\b\u0017\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\b\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u0012\b\u0010\b\u001a\u0004\u0018\u00010\t\u0012\b\u0010\n\u001a\u0004\u0018\u00010\u000b\u0012\b\u0010\f\u001a\u0004\u0018\u00010\r\u00a2\u0006\u0002\u0010\u000eB\u001d\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u0012\u0006\u0010\b\u001a\u00020\t\u00a2\u0006\u0002\u0010\u000fJ\t\u0010\u0018\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u0019\u001a\u00020\u0007H\u00c6\u0003J\t\u0010\u001a\u001a\u00020\tH\u00c6\u0003J\'\u0010\u001b\u001a\u00020\u00002\b\b\u0002\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\tH\u00c6\u0001J\u0013\u0010\u001c\u001a\u00020\u001d2\b\u0010\u001e\u001a\u0004\u0018\u00010\u001fH\u00d6\u0003J\t\u0010 \u001a\u00020\u0003H\u00d6\u0001J\t\u0010!\u001a\u00020\u0005H\u00d6\u0001J!\u0010\"\u001a\u00020#2\u0006\u0010$\u001a\u00020\u00002\u0006\u0010%\u001a\u00020&2\u0006\u0010\'\u001a\u00020(H\u00c7\u0001R\u0011\u0010\b\u001a\u00020\t\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0014\u0010\u0004\u001a\u00020\u0005X\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0014\u0010\n\u001a\u00020\u000bX\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015R\u0014\u0010\u0006\u001a\u00020\u0007X\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u0017\u00a8\u0006+"}, d2 = {"Lnatanfudge/io/logs/LogLine$Message$Error;", "Lnatanfudge/io/logs/LogLine$Message;", "seen1", "", "message", "", "time", "Ljava/time/Instant;", "exception", "", "severity", "Lnatanfudge/io/logs/LogLine$Severity;", "serializationConstructorMarker", "Lkotlinx/serialization/internal/SerializationConstructorMarker;", "(ILjava/lang/String;Ljava/time/Instant;Ljava/lang/Throwable;Lnatanfudge/io/logs/LogLine$Severity;Lkotlinx/serialization/internal/SerializationConstructorMarker;)V", "(Ljava/lang/String;Ljava/time/Instant;Ljava/lang/Throwable;)V", "getException", "()Ljava/lang/Throwable;", "getMessage", "()Ljava/lang/String;", "getSeverity", "()Lnatanfudge/io/logs/LogLine$Severity;", "getTime", "()Ljava/time/Instant;", "component1", "component2", "component3", "copy", "equals", "", "other", "", "hashCode", "toString", "write$Self", "", "self", "output", "Lkotlinx/serialization/encoding/CompositeEncoder;", "serialDesc", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "$serializer", "Companion", "LogViewer"})
        @kotlinx.serialization.SerialName(value = "ErrorLog")
        @kotlinx.serialization.Serializable
        public static final class Error implements natanfudge.io.logs.LogLine.Message {
            @org.jetbrains.annotations.NotNull
            public static final natanfudge.io.logs.LogLine.Message.Error.Companion Companion = null;
            @org.jetbrains.annotations.NotNull
            private final java.lang.String message = null;
            @org.jetbrains.annotations.NotNull
            private final java.time.Instant time = null;
            @org.jetbrains.annotations.NotNull
            private final java.lang.Throwable exception = null;
            @org.jetbrains.annotations.NotNull
            private final natanfudge.io.logs.LogLine.Severity severity = natanfudge.io.logs.LogLine.Severity.Error;
            
            @org.jetbrains.annotations.NotNull
            public final natanfudge.io.logs.LogLine.Message.Error copy(@org.jetbrains.annotations.NotNull
            java.lang.String message, @org.jetbrains.annotations.NotNull
            java.time.Instant time, @org.jetbrains.annotations.NotNull
            java.lang.Throwable exception) {
                return null;
            }
            
            @java.lang.Override
            public boolean equals(@org.jetbrains.annotations.Nullable
            java.lang.Object other) {
                return false;
            }
            
            @java.lang.Override
            public int hashCode() {
                return 0;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public java.lang.String toString() {
                return null;
            }
            
            @kotlin.jvm.JvmStatic
            public static final void write$Self(@org.jetbrains.annotations.NotNull
            natanfudge.io.logs.LogLine.Message.Error self, @org.jetbrains.annotations.NotNull
            kotlinx.serialization.encoding.CompositeEncoder output, @org.jetbrains.annotations.NotNull
            kotlinx.serialization.descriptors.SerialDescriptor serialDesc) {
            }
            
            public Error(@org.jetbrains.annotations.NotNull
            java.lang.String message, @org.jetbrains.annotations.NotNull
            java.time.Instant time, @org.jetbrains.annotations.NotNull
            java.lang.Throwable exception) {
                super();
            }
            
            @org.jetbrains.annotations.NotNull
            public final java.lang.String component1() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public java.lang.String getMessage() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            public final java.time.Instant component2() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public java.time.Instant getTime() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            public final java.lang.Throwable component3() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            public final java.lang.Throwable getException() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public natanfudge.io.logs.LogLine.Severity getSeverity() {
                return null;
            }
            
            @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004H\u00c6\u0001\u00a8\u0006\u0006"}, d2 = {"Lnatanfudge/io/logs/LogLine$Message$Error$Companion;", "", "()V", "serializer", "Lkotlinx/serialization/KSerializer;", "Lnatanfudge/io/logs/LogLine$Message$Error;", "LogViewer"})
            public static final class Companion {
                
                private Companion() {
                    super();
                }
                
                @org.jetbrains.annotations.NotNull
                public final kotlinx.serialization.KSerializer<natanfudge.io.logs.LogLine.Message.Error> serializer() {
                    return null;
                }
            }
            
            @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u00006\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0011\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c7\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0003J\u0018\u0010\b\u001a\f\u0012\b\u0012\u0006\u0012\u0002\b\u00030\n0\tH\u00d6\u0001\u00a2\u0006\u0002\u0010\u000bJ\u0011\u0010\f\u001a\u00020\u00022\u0006\u0010\r\u001a\u00020\u000eH\u00d6\u0001J\u0019\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\u00122\u0006\u0010\u0013\u001a\u00020\u0002H\u00d6\u0001R\u0014\u0010\u0004\u001a\u00020\u00058VX\u00d6\u0005\u00a2\u0006\u0006\u001a\u0004\b\u0006\u0010\u0007\u00a8\u0006\u0014"}, d2 = {"natanfudge/io/logs/LogLine.Message.Error.$serializer", "Lkotlinx/serialization/internal/GeneratedSerializer;", "Lnatanfudge/io/logs/LogLine$Message$Error;", "()V", "descriptor", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "getDescriptor", "()Lkotlinx/serialization/descriptors/SerialDescriptor;", "childSerializers", "", "Lkotlinx/serialization/KSerializer;", "()[Lkotlinx/serialization/KSerializer;", "deserialize", "decoder", "Lkotlinx/serialization/encoding/Decoder;", "serialize", "", "encoder", "Lkotlinx/serialization/encoding/Encoder;", "value", "LogViewer"})
            @java.lang.Deprecated
            public static final class $serializer implements kotlinx.serialization.internal.GeneratedSerializer<natanfudge.io.logs.LogLine.Message.Error> {
                @org.jetbrains.annotations.NotNull
                public static final natanfudge.io.logs.LogLine.Message.Error.$serializer INSTANCE = null;
                
                private $serializer() {
                    super();
                }
                
                @org.jetbrains.annotations.NotNull
                @java.lang.Override
                public kotlinx.serialization.KSerializer<?>[] childSerializers() {
                    return null;
                }
                
                @org.jetbrains.annotations.NotNull
                @java.lang.Override
                public natanfudge.io.logs.LogLine.Message.Error deserialize(@org.jetbrains.annotations.NotNull
                kotlinx.serialization.encoding.Decoder decoder) {
                    return null;
                }
                
                @org.jetbrains.annotations.NotNull
                @java.lang.Override
                public kotlinx.serialization.descriptors.SerialDescriptor getDescriptor() {
                    return null;
                }
                
                @java.lang.Override
                public void serialize(@org.jetbrains.annotations.NotNull
                kotlinx.serialization.encoding.Encoder encoder, @org.jetbrains.annotations.NotNull
                natanfudge.io.logs.LogLine.Message.Error value) {
                }
                
                @org.jetbrains.annotations.NotNull
                public kotlinx.serialization.KSerializer<?>[] typeParametersSerializers() {
                    return null;
                }
            }
        }
        
        @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004H\u00c6\u0001\u00a8\u0006\u0006"}, d2 = {"Lnatanfudge/io/logs/LogLine$Message$Companion;", "", "()V", "serializer", "Lkotlinx/serialization/KSerializer;", "Lnatanfudge/io/logs/LogLine$Message;", "LogViewer"})
        public static final class Companion {
            
            private Companion() {
                super();
            }
            
            @org.jetbrains.annotations.NotNull
            public final kotlinx.serialization.KSerializer<natanfudge.io.logs.LogLine.Message> serializer() {
                return null;
            }
        }
    }
    
    @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0010\u0010\n\u0002\b\u0005\b\u0086\u0001\u0018\u00002\b\u0012\u0004\u0012\u00020\u00000\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002j\u0002\b\u0003j\u0002\b\u0004j\u0002\b\u0005\u00a8\u0006\u0006"}, d2 = {"Lnatanfudge/io/logs/LogLine$Severity;", "", "(Ljava/lang/String;I)V", "Info", "Warn", "Error", "LogViewer"})
    public static enum Severity {
        /*public static final*/ Info /* = new Info() */,
        /*public static final*/ Warn /* = new Warn() */,
        /*public static final*/ Error /* = new Error() */;
        
        Severity() {
        }
    }
    
    @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000D\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\t\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0087\b\u0018\u0000 \u001f2\u00020\u0001:\u0002\u001e\u001fB-\b\u0017\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\b\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u0007\u001a\u0004\u0018\u00010\b\u00a2\u0006\u0002\u0010\tB\u0015\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\nJ\t\u0010\u000e\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u000f\u001a\u00020\u0005H\u00c6\u0003J\u001d\u0010\u0010\u001a\u00020\u00002\b\b\u0002\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u0005H\u00c6\u0001J\u0013\u0010\u0011\u001a\u00020\u00122\b\u0010\u0013\u001a\u0004\u0018\u00010\u0014H\u00d6\u0003J\t\u0010\u0015\u001a\u00020\u0003H\u00d6\u0001J\t\u0010\u0016\u001a\u00020\u0005H\u00d6\u0001J!\u0010\u0017\u001a\u00020\u00182\u0006\u0010\u0019\u001a\u00020\u00002\u0006\u0010\u001a\u001a\u00020\u001b2\u0006\u0010\u001c\u001a\u00020\u001dH\u00c7\u0001R\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\fR\u0011\u0010\u0006\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\f\u00a8\u0006 "}, d2 = {"Lnatanfudge/io/logs/LogLine$Detail;", "Lnatanfudge/io/logs/LogLine;", "seen1", "", "key", "", "value", "serializationConstructorMarker", "Lkotlinx/serialization/internal/SerializationConstructorMarker;", "(ILjava/lang/String;Ljava/lang/String;Lkotlinx/serialization/internal/SerializationConstructorMarker;)V", "(Ljava/lang/String;Ljava/lang/String;)V", "getKey", "()Ljava/lang/String;", "getValue", "component1", "component2", "copy", "equals", "", "other", "", "hashCode", "toString", "write$Self", "", "self", "output", "Lkotlinx/serialization/encoding/CompositeEncoder;", "serialDesc", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "$serializer", "Companion", "LogViewer"})
    @kotlinx.serialization.Serializable
    @kotlinx.serialization.SerialName(value = "DetailLog")
    public static final class Detail implements natanfudge.io.logs.LogLine {
        @org.jetbrains.annotations.NotNull
        public static final natanfudge.io.logs.LogLine.Detail.Companion Companion = null;
        @org.jetbrains.annotations.NotNull
        private final java.lang.String key = null;
        @org.jetbrains.annotations.NotNull
        private final java.lang.String value = null;
        
        @org.jetbrains.annotations.NotNull
        public final natanfudge.io.logs.LogLine.Detail copy(@org.jetbrains.annotations.NotNull
        java.lang.String key, @org.jetbrains.annotations.NotNull
        java.lang.String value) {
            return null;
        }
        
        @java.lang.Override
        public boolean equals(@org.jetbrains.annotations.Nullable
        java.lang.Object other) {
            return false;
        }
        
        @java.lang.Override
        public int hashCode() {
            return 0;
        }
        
        @org.jetbrains.annotations.NotNull
        @java.lang.Override
        public java.lang.String toString() {
            return null;
        }
        
        @kotlin.jvm.JvmStatic
        public static final void write$Self(@org.jetbrains.annotations.NotNull
        natanfudge.io.logs.LogLine.Detail self, @org.jetbrains.annotations.NotNull
        kotlinx.serialization.encoding.CompositeEncoder output, @org.jetbrains.annotations.NotNull
        kotlinx.serialization.descriptors.SerialDescriptor serialDesc) {
        }
        
        public Detail(@org.jetbrains.annotations.NotNull
        java.lang.String key, @org.jetbrains.annotations.NotNull
        java.lang.String value) {
            super();
        }
        
        @org.jetbrains.annotations.NotNull
        public final java.lang.String component1() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull
        public final java.lang.String getKey() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull
        public final java.lang.String component2() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull
        public final java.lang.String getValue() {
            return null;
        }
        
        @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004H\u00c6\u0001\u00a8\u0006\u0006"}, d2 = {"Lnatanfudge/io/logs/LogLine$Detail$Companion;", "", "()V", "serializer", "Lkotlinx/serialization/KSerializer;", "Lnatanfudge/io/logs/LogLine$Detail;", "LogViewer"})
        public static final class Companion {
            
            private Companion() {
                super();
            }
            
            @org.jetbrains.annotations.NotNull
            public final kotlinx.serialization.KSerializer<natanfudge.io.logs.LogLine.Detail> serializer() {
                return null;
            }
        }
        
        @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u00006\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0011\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c7\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0003J\u0018\u0010\b\u001a\f\u0012\b\u0012\u0006\u0012\u0002\b\u00030\n0\tH\u00d6\u0001\u00a2\u0006\u0002\u0010\u000bJ\u0011\u0010\f\u001a\u00020\u00022\u0006\u0010\r\u001a\u00020\u000eH\u00d6\u0001J\u0019\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\u00122\u0006\u0010\u0013\u001a\u00020\u0002H\u00d6\u0001R\u0014\u0010\u0004\u001a\u00020\u00058VX\u00d6\u0005\u00a2\u0006\u0006\u001a\u0004\b\u0006\u0010\u0007\u00a8\u0006\u0014"}, d2 = {"natanfudge/io/logs/LogLine.Detail.$serializer", "Lkotlinx/serialization/internal/GeneratedSerializer;", "Lnatanfudge/io/logs/LogLine$Detail;", "()V", "descriptor", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "getDescriptor", "()Lkotlinx/serialization/descriptors/SerialDescriptor;", "childSerializers", "", "Lkotlinx/serialization/KSerializer;", "()[Lkotlinx/serialization/KSerializer;", "deserialize", "decoder", "Lkotlinx/serialization/encoding/Decoder;", "serialize", "", "encoder", "Lkotlinx/serialization/encoding/Encoder;", "value", "LogViewer"})
        @java.lang.Deprecated
        public static final class $serializer implements kotlinx.serialization.internal.GeneratedSerializer<natanfudge.io.logs.LogLine.Detail> {
            @org.jetbrains.annotations.NotNull
            public static final natanfudge.io.logs.LogLine.Detail.$serializer INSTANCE = null;
            
            private $serializer() {
                super();
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public kotlinx.serialization.KSerializer<?>[] childSerializers() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public natanfudge.io.logs.LogLine.Detail deserialize(@org.jetbrains.annotations.NotNull
            kotlinx.serialization.encoding.Decoder decoder) {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull
            @java.lang.Override
            public kotlinx.serialization.descriptors.SerialDescriptor getDescriptor() {
                return null;
            }
            
            @java.lang.Override
            public void serialize(@org.jetbrains.annotations.NotNull
            kotlinx.serialization.encoding.Encoder encoder, @org.jetbrains.annotations.NotNull
            natanfudge.io.logs.LogLine.Detail value) {
            }
            
            @org.jetbrains.annotations.NotNull
            public kotlinx.serialization.KSerializer<?>[] typeParametersSerializers() {
                return null;
            }
        }
    }
    
    @kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004H\u00c6\u0001\u00a8\u0006\u0006"}, d2 = {"Lnatanfudge/io/logs/LogLine$Companion;", "", "()V", "serializer", "Lkotlinx/serialization/KSerializer;", "Lnatanfudge/io/logs/LogLine;", "LogViewer"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
        
        @org.jetbrains.annotations.NotNull
        public final kotlinx.serialization.KSerializer<natanfudge.io.logs.LogLine> serializer() {
            return null;
        }
    }
}