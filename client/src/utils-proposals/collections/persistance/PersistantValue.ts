import {useEffect, useState} from "react";

export class PersistentValue {
    private readonly key: string

    constructor(key: string) {
        this.key = key;
    }

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
    useEffect(() => {
        setValue(persistent.getValue() ?? defaultValue)
    }, [key])
    return [value, (newValue) => {
        setValue(newValue)
        persistent.setValue(newValue)
    }]
}