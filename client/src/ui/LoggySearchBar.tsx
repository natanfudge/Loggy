import {AutoCompleteConfig, Completion, SearchitBar} from "../fudge-lib/searchit/SearchitBar";
import {AllSeverities} from "../core/Logs";
import styles from "./css/loggy.module.css"
import {State} from "../fudge-lib/state/State";
import {insertWithSpaceCompletion, substringSyncCompletable, syncCompletable} from "../fudge-lib/searchit/SyncCompletable";



// Data for completing level/levelExact:<severity>
const allSeverityCompletions: Completion[] = AllSeverities.flatMap(s => [
    insertWithSpaceCompletion(`level:${s.toLowerCase()}`),
    insertWithSpaceCompletion(`levelExact:${s.toLowerCase()}`),
])

const levelDateCompletable = substringSyncCompletable(allSeverityCompletions)


const loggyCompletables = [levelDateCompletable]


export function LoggySearchBar(props: { query: State<string>, error: string | undefined }) {
    const config: AutoCompleteConfig = {
        completeables: loggyCompletables,
        error: props.error
    }
    return <SearchitBar className={styles.loggySearchBar} config={config}
                        query={props.query}/>
}


