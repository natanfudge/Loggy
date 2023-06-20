import {State} from "fudge-lib/dist/state/State";

// export function mapStateType<T, R>([value, setValue]: State<T>, oldToNew: (old: T) => R, newToOld: (value: R) => T): State<R> {
//     return [oldToNew(value), (newValue) => {
//         if (typeof newValue === "function") {
//             const newValueHandler = newValue as ((value: R) => R)
//             setValue((prevState) => {
//                 const updatedValue = newValueHandler(oldToNew(prevState));
//                 return newToOld(updatedValue)
//             });
//         } else {
//             setValue(newToOld(newValue))
//         }
//     }]
// }
//
// export function mapStateField<T, F extends keyof T>(state: State<T>, field: F): State<T[F]> {
//     return mapStateType(state, range => range[field], fieldValue => ({...state[0], [field]: fieldValue}))
// }