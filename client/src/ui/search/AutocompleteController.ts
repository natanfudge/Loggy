class AutocompleteController {
    completeables
}

interface Completeable {
    /**
     * regular expression that will need to be match for [option]s to show
     */
    trigger: MaybePromise<RegExp>
    options: MaybePromise<string[]>
}

//TODO: async handling
type MaybePromise<T> = T /*| Promise<T>*/