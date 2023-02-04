package natanfudge.io.logs;

import java.lang.System;

@kotlin.Metadata(mv = {1, 8, 0}, k = 1, d1 = {"\u00004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u0003\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c6\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0003J\u0010\u0010\n\u001a\u00020\u00022\u0006\u0010\u000b\u001a\u00020\fH\u0016J\u0018\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\u0002H\u0016R\u0014\u0010\u0004\u001a\u00020\u0005X\u0096\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007R\u0014\u0010\b\u001a\b\u0012\u0004\u0012\u00020\t0\u0001X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0012"}, d2 = {"Lnatanfudge/io/logs/OneWayThrowableSerializer;", "Lkotlinx/serialization/KSerializer;", "", "()V", "descriptor", "Lkotlinx/serialization/descriptors/SerialDescriptor;", "getDescriptor", "()Lkotlinx/serialization/descriptors/SerialDescriptor;", "serializer", "Lnatanfudge/io/logs/ThrowableJsonRepresentation;", "deserialize", "decoder", "Lkotlinx/serialization/encoding/Decoder;", "serialize", "", "encoder", "Lkotlinx/serialization/encoding/Encoder;", "value", "LogViewer"})
public final class OneWayThrowableSerializer implements kotlinx.serialization.KSerializer<java.lang.Throwable> {
    @org.jetbrains.annotations.NotNull
    public static final natanfudge.io.logs.OneWayThrowableSerializer INSTANCE = null;
    private static final kotlinx.serialization.KSerializer<natanfudge.io.logs.ThrowableJsonRepresentation> serializer = null;
    @org.jetbrains.annotations.NotNull
    private static final kotlinx.serialization.descriptors.SerialDescriptor descriptor = null;
    
    private OneWayThrowableSerializer() {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    @java.lang.Override
    public kotlinx.serialization.descriptors.SerialDescriptor getDescriptor() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    @java.lang.Override
    public java.lang.Throwable deserialize(@org.jetbrains.annotations.NotNull
    kotlinx.serialization.encoding.Decoder decoder) {
        return null;
    }
    
    @java.lang.Override
    public void serialize(@org.jetbrains.annotations.NotNull
    kotlinx.serialization.encoding.Encoder encoder, @org.jetbrains.annotations.NotNull
    java.lang.Throwable value) {
    }
}