import {AutoCompleteConfig, Completeable, Completion, syncCompletable} from "./AutocompleteConfig";

const levels = ["info", "warn", "error"]
const levelCompletions = levels.map(level => `level:${level}`)
const levelCompleteable: Completeable = syncCompletable((text) => {
    return levelCompletions.filter(level => level !== text && level.includes(text))
        .map(level => ({
            label: level,
            newText: level + " "
        }))
})

const asyncResults = ["apple", "orange", "fruit", "basket", "evil", "demon"].map(tag => `tag:${tag}`)
const asyncCompletable: Completeable ={
    async options(text: string): Promise<Completion[]> {
        await new Promise(resolve => {
            setTimeout(resolve,2000)
        })
        return asyncResults.filter(level => level !== text && level.includes(text))
            .map(level => ({
                label: level,
                newText: level + " "
            }))
    },
    cancel() {

    }
}


export const autocompleteConfig: AutoCompleteConfig = {
    completeables: [
        levelCompleteable,
        asyncCompletable
    ]
}