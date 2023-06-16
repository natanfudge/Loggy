import {useEffect, useLayoutEffect, useState} from "react";

export class PersistentValue {
    private readonly key: string

    constructor(key: string) {
        this.key = key;
    }
    //TODO: consider making in-memory cache

    getValue(): string | null {
        return localStorage.getItem(this.key)
    }

    setValue(value: string) {
        localStorage.setItem(this.key, value)
    }
}

export function usePersistentState(defaultValue: string, key: string): [string, (value: string) => void] {
    const persistent = new PersistentValue(key)
    const [value, setValue] = useState(persistent.getValue() ?? defaultValue)
    // useLayoutEffect(() => {
    //     setValue(persistent.getValue() ?? defaultValue)
    // }, [key, defaultValue])

    return [value, (newValue) => {
        setValue(newValue)
        persistent.setValue(newValue)
    }]
}