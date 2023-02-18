import com.aayushatharva.brotli4j.Brotli4jLoader
import com.aayushatharva.brotli4j.encoder.Encoder
import com.github.gradle.node.npm.task.NpmTask
import java.nio.file.Files


buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath(libs.bundles.build)
    }
}

plugins {
    alias(libs.plugins.kotlin)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.gradle.node)
    id ("maven-publish")
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
    implementation(libs.bundles.main)
    testImplementation(libs.bundles.test)
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


    val syncClient by registering(Sync::class) {
        dependsOn(buildClient)
        group = "logviewer setup"
        from(clientBuildDir)
        into(sourceSets.main.get().output.resourcesDir!!.resolve("static"))
    }

    publish.get().dependsOn(syncClient)

}

object Utils {
    fun compressFile(content: ByteArray): ByteArray {
        if (!Brotli4jLoader.isAvailable()) {
            Brotli4jLoader.ensureAvailability()
        }
        return Encoder.compress(content)
    }
}

