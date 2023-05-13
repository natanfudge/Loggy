import com.aayushatharva.brotli4j.Brotli4jLoader
import com.aayushatharva.brotli4j.encoder.Encoder
import com.github.gradle.node.npm.task.NpmTask
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile


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
    id("maven-publish")
}

apply(plugin = "io.objectbox") // Apply last.
group = "natanfudge.io"
version = "0.0.1"
application {
    mainClass.set("test.TestAppKt")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=true")
}



kotlin {
    jvmToolchain(17)
    explicitApi()
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xcontext-receivers"
    }
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

val testApp = sourceSets.create("testApp") {
    kotlin.srcDir("src/testApp/kotlin")
    val main = sourceSets.main.get()
    val mainOutput = sourceSets.main.get().output
    compileClasspath += main.compileClasspath + mainOutput
    runtimeClasspath += main.runtimeClasspath + mainOutput
}

afterEvaluate {
    tasks.named("compileTestAppKotlin", KotlinCompile::class) {
        kotlinOptions {
            freeCompilerArgs += "-Xdebug"
        }
    }
}



tasks {
//    task stubRun(type: JavaExec, dependsOn: ['testClasses']) {
//    classpath sourceSets.test.runtimeClasspath
//            main = "StubApplication"
//}
    val runTest by registering(JavaExec::class) {
        group = "test"
        dependsOn("testAppClasses")
        classpath(sourceSets["testApp"].runtimeClasspath)
        mainClass.set("test.TestAppKt")
    }

    val clientBuildDir = clientDir.resolve("dist")

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
        inputs.file("../client/vite.config.ts")

        outputs.dir(clientBuildDir)

        args.set(listOf("run", "build"))
    }


    val syncClient by registering(Sync::class) {
        dependsOn(buildClient)
        group = "logviewer setup"
        from(clientBuildDir)
        into(sourceSets.main.get().output.resourcesDir!!.resolve("__log_viewer__/static"))
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

java {
    withSourcesJar()
}


publishing {
    publications {
        create<MavenPublication>("logViewer") {
            from(components["java"])

            // set the coordinates of the artifact
            groupId = "io.github.natanfudge"
            artifactId = "log-viewer"
            version = "0.1.0"
        }
    }
}