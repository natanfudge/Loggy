pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}
plugins {
    id ("de.fayard.refreshVersions") version "0.51.0"
////                             # available:"0.60.0"
////                             # available:"0.60.1"
////                             # available:"0.60.2"
////                             # available:"0.60.3"
}
rootProject.name = "Loggy"
refreshVersions {
    rejectVersionIf {
        candidate.stabilityLevel.isLessStableThan(current.stabilityLevel)
    }
}