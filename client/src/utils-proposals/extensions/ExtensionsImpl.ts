import "./Extensions"

Array.prototype.last = function <T>(this: T[]): T {
    return this[this.length - 1]
}


Array.prototype.first = function <T>(this: T[]): T {
    return this[0]
}

Array.prototype.dropLast = function<T> (this: T[], amount: number): Array<T> {
    const newArray = new Array(this.length - amount)
    for(let i = 0; i < this.length - amount; i++) {
        newArray[i] = this[i]
    }
    return newArray
}