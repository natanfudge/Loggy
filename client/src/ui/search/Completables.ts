import {AutoCompleteConfig, Completeable, syncCompletable} from "./AutocompleteConfig";
import {isEmptySpace} from "../../utils/Utils";

const levels = ["info", "warn", "error"]
const levelCompletions = levels.map(level => `level:${level}`)
const levelCompleteable: Completeable = syncCompletable((text) => {
    // if (isEmptySpace(text)) return []
    return levelCompletions.filter(level => level !== text && level.includes(text))
        .map(level => ({
            label: level,
            newText: level + " "
        }))
})
export const autocompleteConfig: AutoCompleteConfig = {
    completeables: [
        levelCompleteable
    ]
}