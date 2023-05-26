import {RefObject, useEffect, useState} from "react";

export type Query = string

export namespace AutoComplete {
    export const WidthPx = 300

    /**
     * Must be captured for usage by anchor()
     * @param inputRef ref to the text field the caret is placed in
     */
    export function useCaretPosition(inputRef: RefObject<HTMLInputElement>): CursorPosition | undefined {
        const [caretPosition, setCaretPosition] = useState<CursorPosition | undefined>(undefined);

        useEffect(() => {
            const handleSelectionChange = (): void => {
                if (inputRef.current !== null) {
                    const {x} = getCursorXY(inputRef.current, inputRef.current.selectionStart ?? 0)
                    setCaretPosition({absoluteX: x + inputRef.current.getBoundingClientRect().x, relativeX: x})
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
    export function anchor(caretPosition: CursorPosition | undefined): number | undefined {
        if (caretPosition === undefined) return 0
        if (caretPosition.absoluteX + WidthPx < window.innerWidth) return caretPosition.relativeX
        // If the autocomplete will overflow place it on the left of the text
        else return  caretPosition.relativeX - WidthPx
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

interface CursorPosition {
    relativeX: number;
    absoluteX: number;
}