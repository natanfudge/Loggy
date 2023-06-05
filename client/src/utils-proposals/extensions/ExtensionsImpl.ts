import "./Extensions"
import {HashSet} from "fudge-lib/dist/collections/hashmap/HashSet";

Array.prototype.getOrThrow = function <T>(this: T[], index: number): T {
    if (index < 0) throw new Error(`Index ${index} is negative`)
    if (index >= this.length) throw new Error(`Index ${index} is out of bounds of array of size ${this.length}`)
    return this[index]
}
Array.prototype.last = function <T>(this: T[]): T {
    return this[this.length - 1]
}


Array.prototype.first = function <T>(this: T[]): T {
    return this[0]
}
Array.prototype.firstIndex = function <T>(this: T[], predicate: (item: T) => boolean): number {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) return i;
    }
    throw new Error(`Item matching predicate is missing in array '${JSON.stringify(this)}'!`)
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
    else throw new Error(`Item '${JSON.stringify(item)}' is missing in array '${JSON.stringify(this)}'!`)
}

Array.prototype.distinct = function <T>(this: T[]): Array<T> {
    const newArray = []
    const existingTracker = HashSet.ofCapacity(this.length)
    for (const item of this) {
        if (!existingTracker.contains(item)) {
            newArray.push(item)
            // Track items that were already inserted to prevent duplication
            existingTracker.put(item)
        }
    }
    return newArray
}

Array.prototype.sortedByString = function <T>(this: T[], map: (item: T) => string): Array<T> {
    const sorted = [...this]
    sorted.sort((a, b) => map(a).localeCompare(map(b)))
    return sorted
}

// Array.prototype.splitBy = function<T>(this: T[], predicate: (item: T) => boolean) : [Array<T>,Array<T>] {
//     const matches = []
//     const doesntMatch = []
//     for(const item of this){
//         if(predicate(item)) {
//             matches.push(item)
//         } else {
//             doesntMatch.push(item)
//         }
//     }
// }