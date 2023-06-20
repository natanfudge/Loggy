import {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {AutoCompleteConfig, Completion} from "./AutocompleteConfig";
import {useKeyboardShortcut} from "../../utils-proposals/DomUtils";

export type Query = string

export interface AutoComplete {
    relativeXPosition: number

    query: string

    currentTypedWord: string

    setQuery(query: string): void

    completions: Completion[]

    complete(completion: Completion): void

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

    show(): void

    hide(): void
}

export const AutoCompleteWidthPx = 300

//TODO: Finding search results is buggy and bad.
// 1. pager is not working
// 3. add indicator that search was not submitted
// 4. if we type from:lastw instead of from:lastW the completion character-based progress thing just gives up and doesn't mark up any character.
//   it should also allow a different case when marking up completed characters.
// 5. make sure the refresh button works and gets new results

export function useAutoComplete(config: AutoCompleteConfig, onSubmit: (query: string) => void): AutoComplete {
    // we hold a separate state, because a new value is submitted only sometimes, and we need to take care of every single character change
    // This value is aware of every character change, the input value and onSubmit is only aware of submission changes (Enter pressed, lost focus, etc)
    const [query, setQuery] = useState(config.defaultValue)

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
        query,
        inputRef: textAreaRef,
        setQuery,
        complete,
        completions: results,
        hide() {
            setShown(false)
            onSubmit(query)
            setForceCompletions(false)
        },
        show() {
            setShown(true)
            setForceCompletions(false)
        },
        currentTypedWord: relevantPartOf(query),
        isLoadingCompletions,
        textHackRef
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
                onSubmit(query)
            }, target: textAreaRef, preventDefault: false
        }, [query])

        useKeyboardShortcut({
            // Make sure this doesn't run when we autocomplete (using the same key - enter)
            priority: -1,
            overrideable: true,
            // Enter: submit text. Only relevant when we are not autocompleting something.
            code: "Enter", callback: () => {
                onSubmit(query)
            }, target: textAreaRef,
        })
    }

    function complete(completion: Completion) {
        const {newText, completionEndPosition} = completeWith(completion)
        setQuery(newText)
        // Advance caret to the end of the completion
        forceUpdateCaretPosition(completionEndPosition)
        setForceCompletions(false)
        onSubmit(newText)
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
        const start = query.slice(0, caretPosition.stringIndex).split(" ").dropLast(1).join(" ")
        // Restore the space after the last word preceding the current word if there is one.
        const actualStart = start === "" ? "" : start + " "
        // Get all of the words after the current one
        const end = query.slice(caretPosition.stringIndex).split(" ").drop(1).join(" ")
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
            if (query[i] === " ") break
        }
        return i + 1
    }

    function useResults(): Completion[] {
        const [results, setResults] = useState<Completion[]>([])
        const relevantText = relevantPartOf(query)

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

        if (!shown || (!forceCompletions && relevantText === "")) return []
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


// function textX(input: HTMLInputElement, position) {
//     var inputStyle = window.getComputedStyle(input);
//     var font = inputStyle.getPropertyValue("font");
//     var fontSize = parseFloat(inputStyle.getPropertyValue("font-size"));
//
//     var dummyText = document.createElement("span");
//     dummyText.textContent = input.value.substr(0, position);
//     dummyText.style.font = font;
//     dummyText.style.fontSize = fontSize + "px";
//     dummyText.style.visibility = "hidden";
//
//     document.body.appendChild(dummyText);
//     var textRect = dummyText.getBoundingClientRect();
//     document.body.removeChild(dummyText);
//
//     return inputRect.left + textRect.width;
// }


/////////// Magic function of hell that gets the position of the caret
/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
//TODO: this is really laggy, don't use this
// const getCursorXY = (input: HTMLInputElement, selectionPoint: number) => {
//     const {
//         offsetLeft: inputX,
//         offsetTop: inputY,
//     } = input
//     // create a dummy element that will be a clone of our input
//     const div = document.createElement('div')
//     // get the computed style of the input and clone it onto the dummy element
//     const copyStyle = getComputedStyle(input)
//     for (const prop of copyStyle) {
//         // @ts-ignore
//         div.style[prop] = copyStyle[prop]
//     }
//     // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
//     const swap = '.'
//     const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
//     // set the div content to that of the textarea up until selection
//     const textContent = inputValue.substr(0, selectionPoint)
//     // set the text content of the dummy element div
//     div.textContent = textContent
//     if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
//     // if a single line input then the div needs to be single line and not break out like a text area
//     if (input.tagName === 'INPUT') div.style.width = 'auto'
//     // create a marker element to obtain caret position
//     const span = document.createElement('span')
//     // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
//     span.textContent = inputValue.substr(selectionPoint) /*|| '.'*/
//     // append the span marker to the div
//     div.appendChild(span)
//     // append the dummy element to the body
//     document.body.appendChild(div)
//     // get the marker position, this is the caret position top and left relative to the input
//     const {offsetLeft: spanX, offsetTop: spanY} = span
//     // lastly, remove that dummy element
//     // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
//     document.body.removeChild(div)
//     // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
//     return {
//         x: inputX + spanX,
//         y: inputY + spanY,
//     }
// }

export interface CaretPosition {
    stringIndex: number;
    relativeX: number;
    absoluteX: number;
}