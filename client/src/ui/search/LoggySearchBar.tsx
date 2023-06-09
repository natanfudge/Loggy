import {State} from "../../utils/Utils";
import {MegaSearchBar} from "./MegaSearchBar";
import {AutoCompleteConfig, Completion, syncCompletable} from "./AutocompleteConfig";
import {AllSeverities} from "../../core/Logs";
import {Day} from "../../core/Day";
import {styled} from "@mui/material";
import styles from "./search.module.css"


const allSeverities: Completion[] = AllSeverities.map(s => {
    const atLeast = `level:${s.toLowerCase()}`
    return {label: atLeast, newText: atLeast + " "}
}).concat(AllSeverities.map(s => {
    const exact = `levelExact:${s.toLowerCase()}`
    return {label: exact, newText: exact + " "}
}))

const severityCompletable = syncCompletable(text => {
    return allSeverities.filter(completion => completion.label.includes(text) && text !== completion.label)
})


function dateCompletable(prefix: string) {
    return syncCompletable(text => {
            const dateIndex = text.indexOf(`${prefix}:`)
            if (dateIndex === -1) {
                return prefix.includes(text) ? [{label: `${prefix}:`, newText: `${prefix}:${Day.today().toString()} `}] : []
            }
            return []
        }
    )
}

const loggyCompletables = [severityCompletable, dateCompletable("from"), dateCompletable("to")]


export function LoggySearchBar(props: { query: State<string>, endpoint: string, defaultValue: string }) {
    const config: AutoCompleteConfig = {
        key: props.endpoint,
        completeables: loggyCompletables,
        defaultValue: props.defaultValue
    }
    return <MegaSearchBar className={styles.loggySearchBar} config={config} query={props.query}/>
}

const PaddedSearchBar = styled(MegaSearchBar)`
  padding-right: 30px;
  padding-left: 10px;
`

// export function LoggySearchBarTest() {
//     const query = usePassedState("level:info ")
//     return <div style={{display: "flex", flexDirection: "column"}}>
//         <div style={{padding: "10px 200px"}}>
//             <MegaSearchBar config={loggyCompletables} query={query}/>
//         </div>
//
//         <div>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium ad alias, architecto doloremque
//             doloribus, earum expedita fuga nisi optio perspiciatis quis rerum vitae. Assumenda cupiditate debitis
//             ducimus, est eveniet facere facilis illo molestiae nam nobis. Assumenda ducimus earum eligendi fugiat illum
//             iste libero, molestiae natus possimus recusandae vitae voluptatem.
//         </div>
//     </div>
// }
