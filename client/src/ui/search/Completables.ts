import {AutoCompleteConfig, Completeable, syncCompletable} from "./AutocompleteConfig";

const levels = ["info", "warn", "error"]
const levelCompletions = levels.map(level => `level:${level}`)
const levelCompleteable: Completeable = syncCompletable((text) => {
    return levelCompletions.filter(level => level !== text && level.includes(text))
        .map(level => ({
            label: level,
            newText: level
        }))
})
export const autocompleteConfig: AutoCompleteConfig = {
    completeables: [
        levelCompleteable
    ]
}