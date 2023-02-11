import "./Extensions"
import {TsKey} from "../utils/Utils";

Array.prototype.toRecord = function <T, K extends TsKey, V>(this: Array<T>, map: (element: T, index: number) => [K, V]): Record<K, V> {
    const record = {} as Record<K, V>;
    this.forEach((element, index) => {
        const [key, value] = map(element, index);
        record[key] = value;
    })
    return record;
}

Array.prototype.isEmpty = function <T>(this: T[]): boolean {
    return this.length === 0;
}

