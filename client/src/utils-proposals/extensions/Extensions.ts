
export {}
declare global {

    interface Array<T> {
        last() : T
        first() : T
        dropLast(amount: number): Array<T>
        indexOfOrThrow(item: T): number
    }
}

