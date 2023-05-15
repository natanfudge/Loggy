import {TsKey} from "fudge-lib/dist/types/Basic";

export {}
declare global {

    interface Array<T> {


        isEmpty(): boolean



        toRecord<K extends TsKey, V>(map: (element: T, index: number) => [K, V]): Record<K, V>;


    }
}

