import {TsKey} from "../fudge-lib/types/Basic";

/**
 * Version of the PromiseMemoryCache that stores only one value
 */
export class SimplePromiseMemoryCache<T> {
    private cache: T | undefined = undefined

    // Track promises that have not yet been fulfilled,
    // so when the same value gets requested a second time before the promise has been fulfilled for the first time,
    // we tell it to use the first promise's result instead of executing an entirely new one.
    private ongoingPromises: Promise<T> | undefined

    async get( orProduce: () => Promise<T>): Promise<T> {
        const cached = this.cache;
        if (cached !== undefined) {
            return cached;
        }

        // Try to reuse the recent, last time the value of this key was requested.
        const ongoingPromise = this.ongoingPromises;
        if (ongoingPromise !== undefined) {
            return ongoingPromise;
        }


        const promise = orProduce();
        // Promise not fulfilled yet - store it
        this.ongoingPromises = promise;
        const value = await promise.finally(
            () => {
                 this.ongoingPromises = undefined;
            }
        );
        // Promise fulfilled - we can now use the cache instead and we don't need to store the promise anymore.
        this.cache = value;
        return value;
    }

}

export function recordIsEmpty<K extends TsKey, V>(record: Record<K, V>): boolean {
    return Object.keys(record).length === 0;
}