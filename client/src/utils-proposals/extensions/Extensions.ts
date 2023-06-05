
export {}
declare global {

    interface Array<T> {
        getOrThrow(index: number): T
        last() : T
        first() : T
        firstIndex(predicate: (item: T) => boolean): number
        dropLast(amount: number): Array<T>
        indexOfOrThrow(item: T): number
        sortedByString(map: (item: T) => string): Array<T>
        // splitBy(predicate: (item: T) => boolean): [Array<T>, Array<T>]

        /**
         * Uses Hashset semantics so will respect object structure for equality
         */
        distinct(): Array<T>
    }
}

