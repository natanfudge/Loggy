import {RefObject, useEffect, useRef, useState} from "react";
import {AutocompleteController, Completeable, Completion} from "./AutocompleteController";

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
}

export interface AutoCompleteConfig {
    completeables: Completeable[]
}

//TODO: I'm thinking maybe combining the controller + autocomplete abstractions. useAutoComplete will accept a () => AutocompleteConfig
// object and base everything on that.

const WidthPx = 300
export function useAutoComplete(config: AutoCompleteConfig): AutoComplete {
    const [query, setQuery] = useState<Query>("")
    const textAreaRef = useRef<HTMLInputElement>(null)
    const caretPosition = AutoComplete.useCaretPosition(textAreaRef)
    const results = useResults()

    return {
        anchor: anchor(),
        query: query,
        ref: textAreaRef,
        setQuery: setQuery,
        complete(completion: Completion) {
            setQuery(completeWith(completion))
            // TODO: set caret to correct position
        },
        completions: results
    }

    /**
     * Returns the new text for the query and sets the caret to the correct position
     */
    function completeWith(completion: Completion): string {
        const start = query.slice(0, caretPosition.stringIndex).split(" ").dropLast(1).join(" ")
        const end = query.slice(caretPosition.stringIndex).split(" ").drop(1).join(" ")
        return start + completion.newText + end;
    }

    function anchor(): number {
        if (caretPosition.absoluteX + WidthPx < window.innerWidth) return caretPosition.relativeX
        // If the autocomplete will overflow place it on the left of the text
        else return caretPosition.relativeX - WidthPx
    }

    function useResults(): Completion[] {
        const [results, setResults] = useState<Completion[]>([])
        const relevantText = AutoComplete.relevantText(caretPosition, query)

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

        }, [relevantText])
        return results
    }
}

export namespace AutoComplete {

    /**
     * Must be captured for usage by anchor()
     * @param inputRef ref to the text field the caret is placed in
     */
    export function useCaretPosition(inputRef: RefObject<HTMLInputElement>): CaretPosition {
        const [caretPosition, setCaretPosition] = useState<CaretPosition>({
            stringIndex: 0,
            relativeX: 0,
            absoluteX: 0
        });

        useEffect(() => {
            const handleSelectionChange = (): void => {
                if (inputRef.current !== null) {
                    const selectionIndex = inputRef.current.selectionStart ?? 0
                    const {x} = getCursorXY(inputRef.current, selectionIndex)
                    setCaretPosition(
                        {
                            absoluteX: x + inputRef.current.getBoundingClientRect().x,
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
        }, [inputRef]);

        return caretPosition;
    }

    /**
     * Gets the x offset the autocomplete content should start from
     */
    export function anchor(caretPosition: CaretPosition): number {
        if (caretPosition.absoluteX + WidthPx < window.innerWidth) return caretPosition.relativeX
        // If the autocomplete will overflow place it on the left of the text
        else return caretPosition.relativeX - WidthPx
    }



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

    export function relevantText(cursor: CaretPosition, text: string): string {
        return text.slice(0, cursor.stringIndex).split(" ").last()
    }

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