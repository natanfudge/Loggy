import {Dispatch, SetStateAction, useState} from "react";

// export class PersistentValue {
//     private readonly key: string
//
//     constructor(key: string) {
//         this.key = key;
//     }
//
//     getValue(): string | null {
//         return localStorage.getItem(this.key)
//     }
//
//     setValue(value: string) {
//         localStorage.setItem(this.key, value)
//     }
// }

// export function usePersistentState(key: string, defaultValue: string | (() => string)): [string, (value: string) => void] {
//     const persistent = new PersistentValue(key)
//     const [value, setValue] = useState(
//         persistent.getValue() ?? (typeof defaultValue === "string" ? defaultValue : defaultValue())
//     )
//
//     return [value, (newValue) => {
//         setValue(newValue)
//         persistent.setValue(newValue)
//     }]
// }
//
//
// type State<T> = [T, Dispatch<SetStateAction<T>>]
//
// function listenToStateChange<T>([value, setValue]: State<T>, callback: (value: T) => void): State<T> {
//     return [value, (newValue) => {
//         if (typeof newValue === "function") {
//             const newValueHandler = newValue as ((value: T) => T)
//             setValue((prevState) => {
//                 const updatedValue = newValueHandler(prevState);
//                 callback(updatedValue);
//                 return updatedValue;
//             });
//         } else {
//             setValue(newValue);
//             callback(newValue);
//         }
//     }]
// }