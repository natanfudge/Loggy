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

//TODO: async handling
type MaybePromise<T> = T /*| Promise<T>*/