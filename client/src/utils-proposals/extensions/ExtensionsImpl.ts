import "./Extensions"

Array.prototype.last = function <T>(this: T[]): T {
    return this[this.length - 1]
}


Array.prototype.first = function <T>(this: T[]): T {
    return this[0]
}

