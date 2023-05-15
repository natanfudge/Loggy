package io.github.natanfudge.logs.impl

import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.primaryConstructor

//object EndpointsUtils {
//    inline fun <reified T> acceptUrlArguments(): T {
//
//    }
//}

/**
 * The [type] must have a public primary constructor for all properties
 */
//private class DataClassTypeAdapter<T : Any>(private val type: KClass<T>) {
//    private val parameters = type.declaredMemberProperties
//    // We need to make sure we call the constructor in the correct order
//    private val parameterNamePositions: Map<String, Int> = parameters.mapIndexed { i, p -> p.name to i }.toMap()
//    private val parameterTypes = parameters.map { it.returnType }
//    private val constructor = type.primaryConstructor ?: error("Missing primary constructor of $type")
////    private val constructorMethod: (String) -> T = { constructor.call() }
////    private val
//
//    fun construct(args: Map<String, String>): Result<T> {
//        val argsOrdered = args.toList().sortedBy { (a1, a2) ->
//            val position1 = parameterNamePositions[a1] ?: return Result.failure(IllegalArgumentException("No such parameter $a1 "))
//            parameterNamePositions.getValue()
//        }
//        return constructor.call(*args)
//    }
//
//    // Map from parameter name to parameter constructor
////    fun getParameters(): Map<String, (String) -> T> {
////        val properties =
////    }
//}

private val builtinTypeAdapters: List<SimpleTypeAdapter<*>> = listOf(
    SimpleTypeAdapter.of(String::class) { it },
    SimpleTypeAdapter.of(Long::class) { it.toLong() },
    SimpleTypeAdapter.of(Int::class) { it.toInt() }
)

private interface SimpleTypeAdapter<T : Any> {
    companion object {
        fun <T : Any> of(type: KClass<T>, constructor: (String) -> T) = object : SimpleTypeAdapter<T> {
            override fun construct(string: String): T = constructor(string)
            override val type: KClass<T> = type
        }
    }

    fun construct(string: String): T
    val type: KClass<T>
}

data class TestEndpoint(
    val x: Int,
    val y: String,
    val z: Long
)