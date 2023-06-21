import {MegaSearchBar} from "./MegaSearchBar";
import {AutoCompleteConfig, Completion, syncCompletable} from "./AutocompleteConfig";
import {AllSeverities} from "../../core/Logs";
import {styled} from "@mui/material";
import styles from "./search.module.css"
import {State} from "fudge-lib/dist/state/State";

const AllDateOptions = [
    "today",
    "yesterday",
    "lastWeek",
    "lastMonth"
]



// Data for completing level/levelExact:<severity>
const allSeverityCompletions: Completion[] = AllSeverities.map(s => {
    const atLeast = `level:${s.toLowerCase()}`
    return {label: atLeast, newText: atLeast + " "}
}).concat(AllSeverities.map(s => {
    const exact = `levelExact:${s.toLowerCase()}`
    return {label: exact, newText: exact + " "}
}))

const allDateCompletions: Completion[] = AllDateOptions.map(s => {
    const atLeast = `from:${s}`
    return {label: atLeast, newText: atLeast + " "}
}).concat(AllDateOptions.map(s => {
    const exact = `to:${s}`
    return {label: exact, newText: exact + " "}
}))


const allCompletions = allDateCompletions.concat(allSeverityCompletions)

// Complete level/levelExact:<severity>
const levelDateCompletable = syncCompletable(text => {
    return allCompletions.filter(completion => {
        const lowercaseLabel = completion.label.toLowerCase()
        const lowercaseText = text.toLowerCase()
        return lowercaseLabel.includes(lowercaseText) && lowercaseLabel !== lowercaseText;
    })
})




// complete from/to:<time>
// function dateCompletable(prefix: string) {
//     return syncCompletable(text => {
//         return dateOptions.filter(option => {
//             const fullText =
//             return `${prefix}:${option}`.includes(text);
//         })
//             .map(option => simpleCompletion(`${prefix}:${option}`))
//         // const dateIndex = text.indexOf(`${prefix}:`)
//         // if (dateIndex === -1 ) {
//         //     return prefix.includes(text) ? [
//         //         {label: `${prefix}:`, newText: `${prefix}:today `},
//         //     ].concat(dateOptions.map(option => simpleCompletion(`${prefix}:${option}`))) : []
//         // }
//         // return []
//         }
//     )
// }

function simpleCompletion(value: string): Completion {
    return {
        label: value,
        newText: value
    }
}

const loggyCompletables = [levelDateCompletable/*, dateCompletable("from"), dateCompletable("to")*/]


export function LoggySearchBar(props: { query: State<string>, error: string | undefined }) {
    const config: AutoCompleteConfig = {
        // key: props.endpoint,
        completeables: loggyCompletables,
        submittedValue: props.query.value,
        error: props.error
    }
    return <MegaSearchBar className={styles.loggySearchBar} config={config}
                          onSubmit={(value) => props.query.setValue(value)}/>
}

const PaddedSearchBar = styled(MegaSearchBar)`
  padding-right: 30px;
  padding-left: 10px;
`

