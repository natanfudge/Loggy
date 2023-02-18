export class PromiseMemoryCache<T> {
    private cache: Record<string, T> = {}

    // Track promises that have not yet been fulfilled,
    // so when the same value gets requested a second time before the promise has been fulfilled for the first time,
    // we tell it to use the first promise's result instead of executing an entirely new one.
    private ongoingPromises: Record<string, Promise<T>> = {}

    dumpAll() {
        this.ongoingPromises = {}
        this.cache = {}
    }


    async get(key: string, orProduce: () => Promise<T>): Promise<T> {
        const cached = this.cache[key];
        if (cached !== undefined) {
            return cached;
        }

        // Try to reuse the recent, last time the value of this key was requested.
        const ongoingPromise = this.ongoingPromises[key];
        if (ongoingPromise !== undefined) {
            return ongoingPromise;
        }


        const promise = orProduce();
        // Promise not fulfilled yet - store it
        this.ongoingPromises[key] = promise;
        const value = await promise.finally(
            () => {
                delete this.ongoingPromises[key];
            }
        );
        // Promise fulfilled - we can now use the cache instead and we don't need to store the promise anymore.
        this.cache[key] = value;

        return value;
    }
}
