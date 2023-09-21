import {HashMap} from "../../../fudge-lib/collections/hashmap/HashMap";

export function StaticHashMapFromPairArray<K, V>(array: [K, V][]): HashMap<K, V> {
    const map = new HashMap<K, V>(array.length)
    for (const [key, value] of array) {
        map.put(key, value)
    }
    return map;
}

export function InstanceHashMapGetOr<K, V>(map: HashMap<K, V>, key: K, or: () => V): V {
    return map.get(key) ?? or()
}