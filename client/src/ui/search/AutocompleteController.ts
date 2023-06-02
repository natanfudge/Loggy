export {}
// import {AutoComplete, CaretPosition} from "./Autocomplete";
// import {useEffect, useState} from "react";
//
// export class AutocompleteController {
//     /**
//      * For every completeable provided, autocomplete results will be shown when the triggers match (might be multiple)
//      * Expressions are seperated by spaces.
//      * @private
//      */
//     private readonly completeables: Completeable[]
//
//
//     constructor(completeables: Completeable[]) {
//         this.completeables = completeables;
//     }
//
//     useResults(cursor: CaretPosition, text: string): Completion[] {
//         const [results, setResults] = useState<Completion[]>([])
//         const relevantText = AutoComplete.relevantText(cursor, text)
//
//         useEffect(() => {
//             if (cursor !== undefined) {
//                 const resultsOfText: Completion[] = []
//                 for (const completable of this.completeables) {
//                     // Fetch the results matching the text
//                     completable.options(relevantText).then(options => {
//                         if (!options.isEmpty()) {
//                             resultsOfText.push(...options)
//                         }
//                         setResults(resultsOfText)
//                     }).catch(e => {
//                         console.error(e)
//                     })
//                 }
//                 return () => {
//                     // Cancel http requests and such that are needed to get some completion values
//                     for (const completable of this.completeables) {
//                         completable.cancel(relevantText)
//                     }
//                 }
//             }
//         }, [relevantText])
//         return results
//     }
//
// }
//
// export interface Completion {
//     label: string
//     newText: string
// }
//
// export interface Completeable {
//     /**
//      * Given the text, what completion options should be shown.
//      */
//     options: (text: string) => Promise<Completion[]>
//     /**
//      * Method that will cancel getting the options for [text]
//      */
//     cancel: (text: string) => void
// }
//
// export function syncCompletable(options: (text: string) => Completion[]): Completeable {
//     return {
//         options: (text) => {
//             const value = options(text)
//             return Promise.resolve(value);
//         },
//         cancel: () => {
//         }
//     }
// }
//
// //TODO: async handling
// type MaybePromise<T> = T /*| Promise<T>*/