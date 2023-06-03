import "./Extensions"

Array.prototype.last = function <T>(this: T[]): T {
    return this[this.length - 1]
}


Array.prototype.first = function <T>(this: T[]): T {
    return this[0]
}

Array.prototype.dropLast = function <T>(this: T[], amount: number): Array<T> {
    const newArray = new Array(this.length - amount)
    for (let i = 0; i < this.length - amount; i++) {
        newArray[i] = this[i]
    }
    return newArray
}
Array.prototype.indexOfOrThrow = function <T>(this: T[], item: T): number {
    const index = this.indexOf(item)
    if (index !== -1) return index
    else throw new Error(`Item '${item}' is missing in array '${JSON.stringify(this)}'!`)
}
