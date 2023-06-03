export interface AutoCompleteConfig {
    completeables: Completeable[]
}
export interface Completion {
    /**
     * The text that will be shown in the completion
     */
    label: string
    /**
     * The text that will be inserted instead of the text that user wrote when the completion is selected
     */
    newText: string
}

export function completionsEqual(completionA: Completion, completionB: Completion) : boolean {
    if(completionA === undefined) throw new Error("completionA is unexpectedly undefined")
    if (completionB === undefined) throw new Error("completionB is unexpectedly undefined")
    return completionA.label === completionB.label && completionA.newText === completionB.newText
}

export interface Completeable {
    /**
     * Given the text, what completion options should be shown.
     */
    options: (text: string) => Promise<Completion[]>
    /**
     * Method that will cancel getting the options for [text]
     */
    cancel: (text: string) => void
}



export function syncCompletable(options: (text: string) => Completion[]): Completeable {
    return {
        options: (text) => {
            const value = options(text)
            return Promise.resolve(value);
        },
        cancel: () => {
        }
    }
}
