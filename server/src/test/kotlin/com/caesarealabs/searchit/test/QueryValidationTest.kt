package com.caesarealabs.searchit.test

import com.github.michaelbull.result.Err
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isA

class QueryValidationTest {


    @Test
    fun testValidateTime(): Unit = with(TestQueryParser){
        val result1 = parseQuery("to:10/3 to:20/3")
        val result2 = parseQuery("foo and to:10/3")
        val result3 = parseQuery("to:10/3 and foo")
        val result4 = parseQuery("(to:10/3)")

        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()
        expectThat(result4)
            .isA<Err<*>>()

    }

    @Test
    fun testValidateOperators() : Unit = with(TestQueryParser){
        val result1 = parseQuery("and foo")
        val result2 = parseQuery("bar or")
        val result3 = parseQuery("foo and or bar")
        val result4 = parseQuery("foo not not bad")
        val result5 = parseQuery("foo not")
        val result6 = parseQuery("foo not and bar")

        println(result1)
        println(result2)
        println(result3)
        println(result4)
        println(result5)
        println(result6)

        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()
        expectThat(result4)
            .isA<Err<*>>()
        expectThat(result5)
            .isA<Err<*>>()
        expectThat(result6)
            .isA<Err<*>>()

    }

    @Test
    fun testValidateParentheses() : Unit = with(TestQueryParser){
        val result1 = parseQuery("( foo")
        val result2 = parseQuery("bar)")
        val result3 = parseQuery("(foo or k:v) bar) baz")

        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()
    }

    @Test
    fun testValidateDateContent() : Unit = with(TestQueryParser){
        val result1 = parseQuery("from:1/2/3/4")
        val result2 = parseQuery("from:1/")
        val result3 = parseQuery("from:foo")
        val result4 = parseQuery("from:1/bar")
        val result5 = parseQuery("from:2/3/baz")
        val result6 = parseQuery("from:2/3/1990/")
        val result7 = parseQuery("from:2/30/1990")
        val result8 = parseQuery("from:40/3/1990")
        val result9 = parseQuery("from:20/3/1990 to:19/3/1990")


        expectThat(result1)
            .isA<Err<*>>()
        expectThat(result2)
            .isA<Err<*>>()
        expectThat(result3)
            .isA<Err<*>>()
        expectThat(result4)
            .isA<Err<*>>()
        expectThat(result5)
            .isA<Err<*>>()
        expectThat(result6)
            .isA<Err<*>>()
        expectThat(result7)
            .isA<Err<*>>()
        expectThat(result8)
            .isA<Err<*>>()
        expectThat(result9)
            .isA<Err<*>>()

    }

    @Test
    fun testValidateSeverity() {
        val result = TestQueryParser.parseQuery("level:amar")
        println(result)

        expectThat(result).isA<Err<*>>()
    }
}