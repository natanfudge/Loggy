import {InputAdornment, TextField} from "@mui/material";
import {useAutoComplete} from "./impl/Autocomplete";
import "fudge-lib/dist/extensions/Extensions.js";
import {RadioButtonUnchecked} from "@mui/icons-material";
import {OverlayedAutocompleteContent} from "./impl/SearchItBarImpl";
import {State} from "fudge-lib/dist/state/State";
import {MdRadioButtonUnchecked} from "react-icons/md";

export interface SearchitProps {
    config: AutoCompleteConfig,
    /**
     * The text that is written in the search bar
     * This value only changes on SUBMISSION as in when pressing space, enter, selecting completion, etc.
     * This is so the value can be easily consumed on every state change - whenever query changes, do a new network request.
     */
    query: State<string>
    /**
     * Exposed to allow customizing with styled()
     */
    className?: string,
}

export interface AutoCompleteConfig {
    /**
     * This is the most important part of configuring the completion.
     * Each value specified here denotes something that can be completed.
     * For example, if you want to allow to complete the text "hello",
     * add a completeable that returns an "hello" completion when parts of "hello" are present in the text.
     * You could also add another completable that completes the text "world", but only when the word starts with "hello", etc.
     */
    completeables: Completeable[]

    /**
     * Specify an error that was received as a result of the query to mark the search bar red.
     */
    error: string | undefined
}

export interface Completeable {
    /**
     * Given the text, what completion options should be shown.
     * The `text` passed here is only the currently typed word and not the entire query
     */
    options: (text: string) => Promise<Completion[]>
    /**
     * Method that will cancel getting the options for [text]
     */
    cancel: (text: string) => void
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

/**
 * Easy implementation for completable that assumes no server work is needed for getting the completion results.
 * For server-based completions, implement `Completable` directly.
 */
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



export function SearchitBar(props: SearchitProps) {
    const autocomplete = useAutoComplete(props.config, props.query);


    return <div className={props.className} style={{position: "relative", alignSelf: "center", width: "100%"}}>
        <TextField
            error={props.config.error !== undefined}
            helperText={props.config.error}
            InputProps={
                {
                    startAdornment: (
                        <InputAdornment position="start">
                            <MdRadioButtonUnchecked size = "1.4rem" style={{color: "yellow", visibility: autocomplete.submitted ? "hidden" : undefined}}/>
                        </InputAdornment>
                    )
                }
            }
            inputRef={autocomplete.inputRef} style={{width: "100%"}} autoComplete={"off"}
            value={autocomplete.query}
            onChange={(e) => autocomplete.setQuery(e.target.value)}
            onFocus={autocomplete.show} onBlur={autocomplete.hide} spellCheck={false}
        >
        </TextField>


        <span ref={autocomplete.textHackRef} style={{position: "fixed", top: 0, left: 0, visibility: "hidden"}}>
            {autocomplete.query}
        </span>

        {/*Position the autocomplete in the exact caret position*/}
        <OverlayedAutocompleteContent
            isLoading={autocomplete.isLoadingCompletions}
            typedWord={autocomplete.currentTypedWord}
            items={autocomplete.completions}
            style={{left: autocomplete.relativeXPosition}}
            onSelectItem={(completion) => autocomplete.complete(completion)}/>
    </div>

}
