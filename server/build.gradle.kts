import com.aayushatharva.brotli4j.Brotli4jLoader
import com.aayushatharva.brotli4j.encoder.Encoder
import com.github.gradle.node.npm.task.NpmTask
import java.io.BufferedReader
import java.io.InputStreamReader
import java.nio.file.Files


buildscript {
    val objectboxVersion = "3.5.1"
    repositories {
        mavenCentral()
        // Note: 2.9.0 and older are available on jcenter()
    }
    val brotliVersion = "1.9.0"
    dependencies {
        classpath("io.objectbox:objectbox-gradle-plugin:$objectboxVersion")
        classpath("com.aayushatharva.brotli4j:native-windows-x86_64:$brotliVersion")
        classpath(group = "com.aayushatharva.brotli4j", name = "brotli4j", version = brotliVersion)
        classpath(gradleTestKit())
    }
}
//TODO: in crashy, make sure to use the correct linux objectbox binaries in prod
val ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    kotlin("jvm") version "1.8.10"
    id("io.ktor.plugin") version "2.2.3"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.8.10"
    id("com.github.node-gradle.node") version "3.5.1"
//    id("io.objectbox") // Apply last.
}
apply(plugin = "io.objectbox") // Apply last.
group = "natanfudge.io"
version = "0.0.1"
application {
    mainClass.set("natanfudge.io.ApplicationKt")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=true")
}

kotlin {
    jvmToolchain(17)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-host-common-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-netty-jvm:$ktor_version")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    testImplementation("io.ktor:ktor-server-tests-jvm:$ktor_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
    implementation("org.fusesource.jansi:jansi:2.4.0")
}
val clientDir = projectDir.parentFile.resolve("client")

node {
    nodeProjectDir.set(clientDir)
}

tasks {

    val clientBuildDir = clientDir.resolve("dist")
    val clientCompressedDir = Files.createDirectories(clientBuildDir.resolve("compressed").toPath())

    /**
     * Name: Build Client
     *
     * Operation: Invokes the client build system which builds its output into ../client/build
     *
     * Requirement: NPM client project present in ../client
     */
    val buildClient by registering(NpmTask::class) {
        group = "logviewer setup"

        inputs.dir("../client/src")
        inputs.dir("../client/public")
        inputs.file("../client/package.json")
        inputs.file("../client/tsconfig.json")

        outputs.dir(clientBuildDir)

        args.set(listOf("run", "build"))
    }

    val compressClient by registering {
        dependsOn(buildClient)
        group = "logviewer setup"
        inputs.dir(clientBuildDir)
        outputs.dir(clientCompressedDir)

        doFirst {
            val source = clientBuildDir.toPath()
            Files.walk(source).forEach { path ->
                if (!Files.isDirectory(path) && !path.startsWith(clientCompressedDir)) {
                    val relativePath = source.relativize(path)
                    val destPath = clientCompressedDir.resolve("$relativePath.br")
                    val compressed = compressFile(Files.readAllBytes(path))
                    Files.createDirectories(destPath.parent)
                    Files.write(destPath, compressed)
                }
            }
        }
    }

    val runClientDev by registering {
        group = "logviewer setup"
    }

    val testAsdf by registering {
        doLast {
            println("halo")
        }
    }

    val runDev by registering {
        group = "run"
        doFirst {

        }
    }
}



fun compressFile(content: ByteArray): ByteArray {
    if (!Brotli4jLoader.isAvailable()) {
        Brotli4jLoader.ensureAvailability()
    }
    return Encoder.compress(content)
}