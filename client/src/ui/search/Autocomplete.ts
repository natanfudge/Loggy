import {RefObject, useEffect, useRef, useState} from "react";
import {AutoCompleteConfig, Completion} from "./AutocompleteConfig";

export type Query = string

//TODO: 1. encapsulate the logic of all these autocomplete hooks into an interface
//TODO: 2. make it so completeWith will set the caret position properly

export interface AutoComplete {
    anchor: number
    query: string

    setQuery(query: string): void

    completions: Completion[]

    complete(completion: Completion): void

    ref: RefObject<HTMLInputElement>

    hide(): void

    show(): void

    // showCompletions(): void
}


//TODO: I'm thinking maybe combining the controller + autocomplete abstractions. useAutoComplete will accept a () => AutocompleteConfig
// object and base everything on that.

export const AutoCompleteWidthPx = 300

export function useAutoComplete(config: AutoCompleteConfig): AutoComplete {
    const [query, setQuery] = useState<Query>("")
    // Tracks whether ctrl+space was used to show completions
    const [forceCompletions,setForceCompletions] = useState(false)
    const [shown, setShown] = useState(false)
    const textAreaRef = useRef<HTMLInputElement>(null)
    const caretPosition = useCaretPosition()
    const results = useResults()
    useForceCompleteShortcut();

    return {
        anchor: anchor(),
        query: query,
        ref: textAreaRef,
        setQuery: setQuery,
        complete: complete,
        completions: results,
        hide(){
            setShown(false)
            setForceCompletions(false)
        },
        show() {
            setShown(true)
            setForceCompletions(false)
        }
    }

    function useForceCompleteShortcut() {
        useEffect(() => {
            const handleKeyPress = (event: KeyboardEvent) => {
                // CTRL + Space: show completions now
                if (textAreaRef.current === document.activeElement && event.ctrlKey && event.code === 'Space') {
                    setForceCompletions(true)
                } else if(event.code === 'Space') {
                    // If the user inserts a space stop forcing completions
                    setForceCompletions(false)
                }
            };

            // Attach the event listener when the component mounts
            document.addEventListener('keydown', handleKeyPress);

            // Remove the event listener when the component unmounts
            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        }, []);
    }

    function complete(completion: Completion) {
        const {newText, completionEndPosition} = completeWith(completion)
        setQuery(newText)
        setCaretPosition(completionEndPosition)
        setForceCompletions(false)
    }

    function setCaretPosition(index: number) {
        if (textAreaRef.current !== null) {
            // textAreaRef.current.focus()
            textAreaRef.current.selectionStart = index
            textAreaRef.current.selectionEnd = index
        }
    }

    function useCaretPosition(): CaretPosition {
        const [caretPosition, setCaretPosition] = useState<CaretPosition>({
            stringIndex: 0,
            relativeX: 0,
            absoluteX: 0
        });

        useEffect(() => {
            const handleSelectionChange = (): void => {
                if (textAreaRef.current !== null) {
                    const selectionIndex = textAreaRef.current.selectionStart ?? 0
                    const {x} = getCursorXY(textAreaRef.current, selectionIndex)
                    setCaretPosition(
                        {
                            absoluteX: x + textAreaRef.current.getBoundingClientRect().x,
                            relativeX: x,
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

        const startOfWordPosition = getCursorXY(input, getStartOfWordIndex()).x
        // If the autocomplete will not overflow place it to the right of the text
        if (caretPosition.absoluteX + AutoCompleteWidthPx < window.innerWidth) return startOfWordPosition
        // If the autocomplete will overflow place it on the left of the text
        else return startOfWordPosition - AutoCompleteWidthPx
    }

    function getStartOfWordIndex(): number {
        let i = caretPosition.stringIndex
        for (; i >= 0; i--) {
            if (query[i] === " ") break
        }
        return i + 1
    }

    function useResults(): Completion[] {
        const [results, setResults] = useState<Completion[]>([])
        const relevantText = relevantPartOf(query)

        useEffect(() => {
            const resultsOfText: Completion[] = []
            for (const completable of config.completeables) {
                // Fetch the results matching the text
                completable.options(relevantText).then(options => {
                    if (!options.isEmpty()) {
                        resultsOfText.push(...options)
                    }
                    setResults(resultsOfText)
                }).catch(e => {
                    console.error(e)
                })
            }
            return () => {
                // Cancel http requests and such that are needed to get some completion values
                for (const completable of config.completeables) {
                    completable.cancel(relevantText)
                }
            }

        }, [relevantText, forceCompletions])

        if (!shown || !forceCompletions && relevantText === "") return []
        return results
    }

    function relevantPartOf(text: string): string {
        return text.slice(0, caretPosition.stringIndex).split(" ").last()
    }
}

export namespace AutoComplete {


    // /**
    //  * Completes one string with another
    //  * For example: level:i + info = level:info
    //  * For example: level:o + info = level:info
    //  */
    // function complete(start: string, end: string): string {
    //     let startIndex: number = start.length - 1
    //     for (; startIndex >= 0; startIndex--) {
    //         const endIndex = start.length - 1 - startIndex
    //         if (endIndex < 0) break;
    //         if (start[startIndex] !== end[endIndex]) break;
    //     }
    //
    //     return start.substring(0, startIndex - 1) + end;
    // }


}

/////////// Magic function of hell that gets the position of the caret
/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
const getCursorXY = (input: HTMLInputElement, selectionPoint: number) => {
    const {
        offsetLeft: inputX,
        offsetTop: inputY,
    } = input
    // create a dummy element that will be a clone of our input
    const div = document.createElement('div')
    // get the computed style of the input and clone it onto the dummy element
    const copyStyle = getComputedStyle(input)
    for (const prop of copyStyle) {
        // @ts-ignore
        div.style[prop] = copyStyle[prop]
    }
    // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
    const swap = '.'
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
    // set the div content to that of the textarea up until selection
    const textContent = inputValue.substr(0, selectionPoint)
    // set the text content of the dummy element div
    div.textContent = textContent
    if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
    // if a single line input then the div needs to be single line and not break out like a text area
    if (input.tagName === 'INPUT') div.style.width = 'auto'
    // create a marker element to obtain caret position
    const span = document.createElement('span')
    // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
    span.textContent = inputValue.substr(selectionPoint) /*|| '.'*/
    // append the span marker to the div
    div.appendChild(span)
    // append the dummy element to the body
    document.body.appendChild(div)
    // get the marker position, this is the caret position top and left relative to the input
    const {offsetLeft: spanX, offsetTop: spanY} = span
    // lastly, remove that dummy element
    // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
    document.body.removeChild(div)
    // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
    return {
        x: inputX + spanX,
        y: inputY + spanY,
    }
}

export interface CaretPosition {
    stringIndex: number;
    relativeX: number;
    absoluteX: number;
}