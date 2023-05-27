import {AutocompleteController, Completeable, syncCompletable} from "./AutocompleteController";
import {AutoCompleteConfig} from "./Autocomplete";

const levels = ["info", "warn", "error"]
const levelCompleteable: Completeable = syncCompletable((text) => {
    if (!text.startsWith("level:")) return []
    const relevantPart = text.removeBeforeFirstExclusive(":")

    return levels.filter(level => level !== relevantPart && level.includes(relevantPart))
        .map(level => ({
            label: level,
            newText: `level:${level}`
        }))
})
export const autocompleteConfig : AutoCompleteConfig = {completeables: [
    levelCompleteable
]}