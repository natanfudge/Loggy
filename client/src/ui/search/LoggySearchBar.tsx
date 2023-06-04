import {State, usePassedState} from "../../utils/Utils";
import {MegaSearchBar} from "./MegaSearchBar";
import {AutoCompleteConfig, Completion, syncCompletable} from "./AutocompleteConfig";
import {AllSeverities} from "../../core/Logs";
import {Day} from "../../core/Day";
import {styled} from "@mui/material";

const allCompletions: Completion[] = AllSeverities.map(s => {
    const label = `level:${s.toLowerCase()}`
    return ({
        label: label, newText: label + " "
    });
})
const levelCompletable = syncCompletable(text => {
    return allCompletions.filter(completion => completion.label.includes(text) && text !== completion.label)
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

const loggyCompletables: AutoCompleteConfig = {
    completeables: [levelCompletable, dateCompletable("from"), dateCompletable("to")]
}

export function LoggySearchBar(props: {query: State<string>}) {
    return<StyledSearchBar config={loggyCompletables} query={props.query}/>
}

const StyledSearchBar = styled(MegaSearchBar)`
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
