import React from "react";
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

export type StringMap = Record<string, string>

export  function recordToArray<V,Rec extends Record<keyof Rec, V>,K extends keyof Rec, R>(record: Record<K,V>, mapFn: (key: K, value: V, index: number) => R): R[] {
    return typedKeys(record).map((key, index) => mapFn(key, record[key], index));
}

export function typedKeys<K extends TsKey, V>(object: Record<K, V>): K[] {
    return Object.keys(object) as K[];
}

export type TsKey = string | number | symbol

export function timeToString(date: Dayjs): string {
    return `${simpleTimeToString(date)}:${threeChars(date.millisecond())}`
}

export function simpleTimeToString(date: Dayjs): string {
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

export function dayToString(date: Dayjs): string {
    return `${twoChars(date.day())}/${twoChars(date.month() + 1)}/${twoChars(date.year())}`
}

export function addAlphaToColor(color: string, alpha: number): string {
    if (!color) return '';
    if (!color.startsWith('#')) return color;

    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}