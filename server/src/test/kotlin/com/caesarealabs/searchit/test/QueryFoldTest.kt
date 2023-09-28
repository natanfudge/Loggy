package com.caesarealabs.searchit.test

import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.getOrThrow
import com.caesarealabs.searchit.impl.QueryParser
import com.caesarealabs.searchit.impl.QueryParser.FoldedToken.*
import com.caesarealabs.searchit.impl.QueryToken
import com.caesarealabs.searchit.impl.QueryToken.KeyValue
import com.caesarealabs.searchit.impl.QueryToken.Operator.And
import com.caesarealabs.searchit.impl.QueryToken.Operator.Or
import com.caesarealabs.searchit.impl.QueryToken.Raw
import com.caesarealabs.searchit.impl.QueryTokenizer
import org.junit.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo

class QueryFoldTest {
    @Test
    fun testFoldFilters() {
        "".assertFolding(listOf())
        "foo".assertFolding(listOf(raw("foo")))
        "not bad".assertFolding(listOf(not("bad")))

        "((foo or (k:v and shit)) bar) baz".assertFolding(
            listOf(
                "foo" or (KeyValue("k","v") and "shit"),
                raw("bar"),
                raw("baz")
            )
        )
        "(complex or some shit) like (not that) and not (great or stuff)".assertFolding(
            listOf(
                ("complex" or ("some" and "shit")),
                raw("like"),
                not("that"),
                Not("great" or "stuff")
            )
        )

        "(complex or not (some or (bro or bruh)) shit) like (not that) and not (great or stuff)".assertFolding(
            listOf(
                ("complex" or not(("some" or ("bro" or "bruh") and "shit"))),
                raw("like"),
                not("that"),
                Not("great" or "stuff")
            )
        )

    }

    private infix fun QueryParser.FoldedToken.or(other: QueryParser.FoldedToken) = Binary(Or, this ,other)
    private infix fun QueryParser.FoldedToken.or(other: QueryToken.WithContent) = Binary(Or, this ,Single(other))
    private infix fun QueryToken.WithContent.or(other: QueryParser.FoldedToken) = Binary(Or, Single(this) ,other)
    private infix fun QueryParser.FoldedToken.or(other: String) = Binary(Or, this ,raw(other))
    private infix fun String.or(other: QueryParser.FoldedToken) = Binary(Or, raw(this) ,other)
    private infix fun String.or(other: String) = Binary(Or, raw(this) ,raw(other))
    private infix fun QueryParser.FoldedToken.and(other: QueryParser.FoldedToken) = Binary(And, this ,other)
    private infix fun QueryParser.FoldedToken.and(other: QueryToken.WithContent) = Binary(And, this ,Single(other))
    private infix fun QueryParser.FoldedToken.and(other: String) = Binary(And, this ,raw(other))
    private infix fun QueryToken.WithContent.and(other: QueryParser.FoldedToken) = Binary(And, Single(this) ,other)

    private infix fun String.and(other: QueryToken.WithContent) = Binary(And, raw(this) ,Single(other))
    private infix fun QueryToken.WithContent.and(other: String) = Binary(And, Single(this) ,raw(other))
    private infix fun String.and(other: String) = Binary(And, raw(this) ,raw(other))

    private fun not(target: String) = Not(raw(target))
    private fun not(target: QueryParser.FoldedToken) = Not(target)

    private fun raw(string: String) = Single(Raw(string))


    //"((foo or (k:v and shit)) bar) baz"
    private fun String.assertFolding(folding: List<QueryParser.FoldedToken>) = expectThat(this)
        .and { get { TestQueryParser.parseQuery(this) }
            .describedAs { this.toString() }
            .isA<Ok<*>>() }
        .get { TestQueryParser.foldFilters(QueryTokenizer.tokenize(this).getOrThrow { AssertionError("Failed to tokenize query $this: $it") }).toList() }
        .isEqualTo(folding.toList())
}