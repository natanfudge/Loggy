import {State} from "../../utils/Utils";
import {MegaSearchBar} from "./MegaSearchBar";
import {AutoCompleteConfig, Completion, syncCompletable} from "./AutocompleteConfig";
import {AllSeverities} from "../../core/Logs";
import {styled} from "@mui/material";
import styles from "./search.module.css"

const AllDateOptions = [
    "today",
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


export function LoggySearchBar(props: { query: State<string> }) {
    const config: AutoCompleteConfig = {
        // key: props.endpoint,
        completeables: loggyCompletables,
        defaultValue: props.query.value
    }
    return <MegaSearchBar className={styles.loggySearchBar} config={config}
                          onSubmit={(value) => props.query.onChange(value)}/>
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
