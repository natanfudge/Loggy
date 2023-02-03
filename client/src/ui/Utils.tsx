import React from "react";
import styled from "@emotion/styled";

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
