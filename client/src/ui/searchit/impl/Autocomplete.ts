import {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {AutoCompleteConfig, Completion} from "../SearchitBar";
import {State, useStateObject} from "fudge-lib/dist/state/State";
import {useKeyboardShortcut} from "../../../utils-proposals/Keyboard";


export interface AutoComplete {
    /**
     * X position of the autocomplete popup relative to the search bar
     */
    relativeXPosition: number

    /**
     * Current content that is being autocompleted
     */
    query: State<string>

    // setQuery(query: string): void

    /**
     * Current word that is being typed, for example when writing "The great hor", the current typed word would be "hor" at the end.
     */
    currentTypedWord: string

    /**
     * Autocomplete results
     */
    completions: Completion[]

    /**
     * Calling this will modify the query to complete with the specified completion
     */
    complete(completion: Completion): void

    /**
     * True after the user has started typing but no response was received from the server yet
     */
    isLoadingCompletions: boolean
    // Note: the padding and margin of the input field MUST BE STATIC!
    // Note: don't change the font of the input field because we depend on the default with the textHackRef hack
    inputRef: RefObject<HTMLInputElement>

    /**
     * This is a hack we use to get the coordinates of the caret given an index.
     * We place an invisible span identical to the input field. Then when we want to get the relative position of text,
     * we use a range to check the text. We can then apply the same values to our input field.
     */
    textHackRef: RefObject<HTMLSpanElement>

    /**
     * Will show the autocomplete items
     */
    show(): void
    /**
     * Will hide the autocomplete items
     */
    hide(): void

    /**
     * False if the user has typed something but hasn't triggered a network request for the query yet
     */
    submitted: boolean
}

export const AutoCompleteWidthPx = 300


export function useAutoComplete(config: AutoCompleteConfig, queryState: State<string>): AutoComplete {
    // we hold a separate state, because a new value is submitted only sometimes, and we need to take care of every single character change
    // This value is aware of every character change, the input value and onSubmit is only aware of submission changes (Enter pressed, lost focus, etc)
    const textState = useStateObject(queryState.value)
    const [text, setText] = textState.destruct()

    // Tracks whether ctrl+space was used to show completions
    const [forceCompletions, setForceCompletions] = useState(false)
    const [shown, setShown] = useState(false)
    const textAreaRef = useRef<HTMLInputElement>(null)
    const textHackRef = useRef<HTMLSpanElement>(null)
    const [caretPosition, setCaretPosition] = useState<CaretPosition>({
        stringIndex: 0,
        relativeX: 0,
        absoluteX: 0
    });
    const [isLoadingCompletions, setIsLoadingCompletions] = useState(false)

    // Important note: we measure the padding and margin of the input field only once for positioning elements correctly.
    const textAreaStyle = useMemo(() => {
        return textAreaRef.current === null ? null : window.getComputedStyle(textAreaRef.current)
    }, [textAreaRef.current])

    useCaretPosition()
    const results = useResults()
    useShortcuts();

    return {
        relativeXPosition: anchor(),
        query: textState,
        inputRef: textAreaRef,
        // setQuery: setText,
        complete,
        completions: results,
        hide() {
            setShown(false)
            queryState.setValue(text)
            setForceCompletions(false)
        },
        show() {
            setShown(true)
            setForceCompletions(false)
        },
        currentTypedWord: relevantPartOf(text),
        isLoadingCompletions,
        textHackRef,
        submitted: text.trim() === queryState.value.trim()
    }


    function useShortcuts() {
        useKeyboardShortcut({
            code: "Space", callback: () => {
                // CTRL + Space: show completions now
                setForceCompletions(true)
            }, target: textAreaRef, ctrl: true
        })

        useKeyboardShortcut({
            code: "Space", callback: () => {
                // If the user inserts a space stop forcing completions
                setForceCompletions(false)
                queryState.setValue(text)
            }, target: textAreaRef, preventDefault: false
        }, [text])

        useKeyboardShortcut({
            // Make sure this doesn't run when we autocomplete (using the same key - enter)
            priority: -1,
            overrideable: true,
            // Enter: submit text. Only relevant when we are not autocompleting something.
            code: "Enter", callback: () => {
                queryState.setValue(text)
            }, target: textAreaRef,
        })
    }

    function complete(completion: Completion) {
        const {newText, completionEndPosition} = completeWith(completion)
        setText(newText)
        // Advance caret to the end of the completion
        forceUpdateCaretPosition(completionEndPosition)
        setForceCompletions(false)
        queryState.setValue(newText)
    }

    function forceUpdateCaretPosition(index: number) {
        if (textAreaRef.current !== null) {
            textAreaRef.current.selectionStart = index
            textAreaRef.current.selectionEnd = index
        }
        // Also update our state to prevent visual jumping back and forth
        setCaretPosition(old => ({...old, stringIndex: index}))
    }

    function useCaretPosition(): CaretPosition {
        useLayoutEffect(() => {
            const handleSelectionChange = (): void => {
                if (textAreaRef.current !== null) {
                    const selectionIndex = textAreaRef.current.selectionStart ?? 0
                    const {relative, absolute} = getTextX(selectionIndex)
                    setCaretPosition(
                        {
                            absoluteX: absolute,
                            relativeX: relative,
                            stringIndex: selectionIndex
                        }
                    )
                }
            };

            document.addEventListener('selectionchange', handleSelectionChange);
            document.addEventListener("input", handleSelectionChange)

            return () => {
                document.removeEventListener('selectionchange', handleSelectionChange);
                document.removeEventListener('input', handleSelectionChange);
            };
        }, [textAreaRef]);

        return caretPosition;
    }


    /**
     * Returns the new text for the query and sets the caret to the correct position
     */
    function completeWith(completion: Completion): { newText: string, completionEndPosition: number } {
        const start = text.slice(0, caretPosition.stringIndex).split(" ").dropLast(1).join(" ")
        // Restore the space after the last word preceding the current word if there is one.
        const actualStart = start === "" ? "" : start + " "
        // Get all of the words after the current one
        const end = text.slice(caretPosition.stringIndex).split(" ").drop(1).join(" ")
        return {
            newText: actualStart + completion.newText + end,
            completionEndPosition: actualStart.length + completion.newText.length
        };
    }

    function anchor(): number {
        const input = textAreaRef.current
        if (input === null) return 0

        const {relative, absolute} = getTextX(getStartOfWordIndex())
        // If the autocomplete will not overflow place it to the right of the text
        if (absolute + AutoCompleteWidthPx < window.innerWidth) return relative
        // If the autocomplete will overflow place it on the left of the text
        else return relative - AutoCompleteWidthPx
    }

    function getStartOfWordIndex(): number {
        let i = caretPosition.stringIndex - 1
        for (; i >= 0; i--) {
            if (text[i] === " ") break
        }
        return i + 1
    }

    function useResults(): Completion[] {
        const [results, setResults] = useState<Completion[]>([])
        const relevantText = relevantPartOf(text)

        useEffect(() => {
            let resultsOfText: Completion[] = []
            let canceled = false

            const allCompletions = config.completeables.map(completable => completable.options(relevantText))

            setIsLoadingCompletions(true)
            for (const completionPromise of allCompletions) {
                completionPromise.then(completions => {
                    if (!canceled) {
                        if (!completions.isEmpty()) {
                            resultsOfText = resultsOfText.concat(completions)
                        }
                        setResults(resultsOfText)
                    }
                }).catch(e => {
                    console.error(e)
                })
            }


            Promise.all(allCompletions).then(() => {
                if (!canceled) {
                    setIsLoadingCompletions(false)
                }
            }).catch(e => {
                console.error(e)
            })


            return () => {
                canceled = true
                // Cancel http requests and such that are needed to get some completion values
                for (const completable of config.completeables) {
                    completable.cancel(relevantText)
                }
            }

        }, [relevantText, forceCompletions])
        if (!shown || (!(config.alwaysShowCompletions ?? false) && !forceCompletions && relevantText === "")) return []
        //TODO: distinct() call might fail if we have more fields in Completion
        return results.distinct()
    }

    function relevantPartOf(text: string): string {
        return text.slice(0, caretPosition.stringIndex).split(" ").last()
    }

    // x: 177.2

    function getTextX(caretIndex: number): { relative: number, absolute: number } {
        if (textAreaRef.current === null) {
            return {relative: 0, absolute: 0}
        }
        const relative = getRelativeTextX(caretIndex)
        return {
            relative,
            absolute: relative + textAreaRef.current.getBoundingClientRect().x
        }
    }

    function getRelativeTextX(caretIndex: number): number {
        if (textHackRef.current === null || textAreaStyle === null) {
            return 0
        }

        const range = document.createRange()
        const textNodes = textHackRef.current.childNodes[0]
        if (textNodes === undefined) return 0
        range.setStart(textNodes, 0)
        try {
            // If the caret index is too big - just place at the end
            range.setEnd(textNodes, caretIndex)
        } catch (e) {
            range.setEndAfter(textNodes)
        }

        const rect = range.getClientRects()[0]
        if (rect === undefined) return 0;
        const textWidth = rect.width
        const paddingAndMargin = parseDistanceValue(textAreaStyle.paddingLeft) + parseDistanceValue(textAreaStyle.marginLeft)
        return textWidth + paddingAndMargin
    }
}

function parseDistanceValue(distanceString: string): number {
    if (distanceString === "") return 0
    else if (distanceString.endsWith("px")) return parseInt(distanceString.removeSuffix("px"))
    else {
        throw new Error(`Expected padding/margin ${distanceString} to only be px-based, not ${distanceString}!`)
    }
}



export interface CaretPosition {
    stringIndex: number;
    relativeX: number;
    absoluteX: number;
}