import {AutoCompleteConfig, Completion, SearchitBar} from "../fudge-lib/searchit/SearchitBar";
import {AllSeverities} from "../core/Logs";
import styles from "./css/loggy.module.css"
import {State} from "../fudge-lib/state/State";
import {syncCompletable} from "../fudge-lib/searchit/SyncCompletable";

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


const loggyCompletables = [levelDateCompletable/*, dateCompletable("from"), dateCompletable("to")*/]


export function LoggySearchBar(props: { query: State<string>, error: string | undefined }) {
    const config: AutoCompleteConfig = {
        // key: props.endpoint,
        completeables: loggyCompletables,
        // submittedValue: props.query.value,
        error: props.error
    }
    return <SearchitBar className={styles.loggySearchBar} config={config}
                        query={props.query}/>
}


