import {AutocompleteController, Completeable, syncCompletable} from "./AutocompleteController";

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
export const autocompleteController = new AutocompleteController([
    levelCompleteable
])