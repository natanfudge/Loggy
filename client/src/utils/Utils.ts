import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import {Dayjs} from "dayjs";

export const Row = styled.div`
    display: flex;
  flex-direction: row;
`
export const Column = styled.div`
    display: flex;
  flex-direction: column;
`

export function usePromise<T>(promise: Promise<NonNullable<T>> | T, deps: unknown[]): T | undefined {
    const [result, setResult] = useState<T | undefined>(undefined)
    useEffect(() => {
        setResult(undefined);
        void Promise.resolve(promise).then((value => {
            setResult(value)
        }))
    }, deps)
    return result
}


export type StringMap = Record<string, string>

export  function recordToArray<V,Rec extends Record<keyof Rec, V>,K extends keyof Rec, R>(record: Record<K,V>, mapFn: (key: K, value: V, index: number) => R): R[] {
    return typedKeys(record).map((key, index) => mapFn(key, record[key], index));
}

export function typedKeys<K extends TsKey, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export type TsKey = string | number | symbol

export function millsecondTimeToString(date: Dayjs): string {
    return `${timeToString(date)}:${threeChars(date.millisecond())}`
}


export function timeToString(date: Dayjs): string {
    if (!isDayJs(date)) {
        throw new Error(`Unexpected type of date: ${date} of type ${typeof date}`)
    }
    return `${simpleTimeToString(date)}:${twoChars(date.second())}`
}

export function simpleTimeToString(date: Dayjs): string {
    // console.log("Date: " + typeof date)
    return `${twoChars(date.hour())}:${twoChars(date.minute())}`
}

export function twoChars(number: number): string {
    const str = String(number)
    if (str.length == 1) return `0${str}`
    else return str.substring(str.length - 2, str.length)
}

export function threeChars(number: number): string {
    const str = String(number)
    if (str.length == 1) return `00${str}`
    if (str.length == 2) return `0${str}`
    else return str
}


export function addAlphaToColor(color: string, alpha: number): string {
    if (!color) return '';
    if (!color.startsWith('#')) return color;

    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface State<T> {
    value: T
    onChange: (value: T) => void
}

export function isDayJs(obj: unknown): boolean {
    return obj !== null && typeof obj === "object" && "millisecond" in obj;
}

export function unixMs(date: Dayjs): number {
    return date.unix() * 1000 + date.millisecond()
}