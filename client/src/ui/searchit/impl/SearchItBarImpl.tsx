import {CircularProgress, styled, useTheme} from "@mui/material";
import {AutoCompleteWidthPx} from "./Autocomplete";
import {CSSProperties, Fragment, MouseEventHandler, useEffect, useState} from "react";
import { completionsEqual } from "./CompletionUtils";
import {Completion} from "../SearchitBar";
import {useKeyboardShortcut} from "../../../fudge-lib/react/Keyboard";

export const OverlayedAutocompleteContent = styled(AutocompleteContent)`
  position: absolute;
  margin-top: -15px;
  width: ${AutoCompleteWidthPx}px;
  z-index: 10000;
`

interface AutoCompleteContentProps {
    className?: string,
    style: CSSProperties
    items: Completion[]
    onSelectItem: (item: Completion) => void
    typedWord: string
    isLoading: boolean
}


export function AutocompleteContent(props: AutoCompleteContentProps) {
    if (props.items.isEmpty()) {
        return <Fragment/>
    }
    return <NonEmptyAutocompleteContent {...props}/>
}

const MaxItems = 10

function NonEmptyAutocompleteContent(props: AutoCompleteContentProps) {
    const items = props.items
    const [activeItem, setActiveItem] = useState<Completion>(items[0])
    // We show only part of the completions so they won't overflow out of the screen
    const [firstVisibleIndex, setFirstVisibleIndex] = useState(0)
    const lastVisibleIndex = Math.min(firstVisibleIndex + MaxItems - 1, items.length - 1)

    function indexOf(completion: Completion): number {
        return items.firstIndex(item => completionsEqual(item, completion))
    }

    useEffect(() => {
        if (items.none(item => completionsEqual(item, activeItem))) setActiveItem(items[0])
    }, [items, activeItem])

    // Go down in selection when down is pressed
    useKeyboardShortcut({
        code: "ArrowDown", callback: () => {
            const index = indexOf(activeItem)
            // Wrap around when end is reached
            const newIndex = index < items.length - 1 ? index + 1 : 0
            // Move visible window down if edge has been reached
            if (newIndex > lastVisibleIndex) setFirstVisibleIndex(oldStart => oldStart + 1)
            // In case we have wrapped around to the start - set first visible item accordingly
            else if (newIndex === 0) setFirstVisibleIndex(0)

            setActiveItem(items.getOrThrow(newIndex))
        }
    }, [items, activeItem])

    // Go up in selection when up is pressed
    useKeyboardShortcut({
        code: "ArrowUp", callback: () => {
            const index = indexOf(activeItem)
            // Wrap around when end is reached
            const newIndex = index > 0 ? index - 1 : items.length - 1
            // Move visible window up if edge has been reached
            if (newIndex < firstVisibleIndex) setFirstVisibleIndex(oldStart => oldStart - 1)
            // In case we have wrapped around to the end - set first visible item accordingly
            else if (newIndex === items.length - 1) setFirstVisibleIndex(items.length - MaxItems)

            setActiveItem(items.getOrThrow(newIndex))
        }
    }, [items, activeItem])

    // Complete with selected item when enter is pressed
    useKeyboardShortcut({
        code: "Enter", callback: () => {
            const index = indexOf(activeItem)
            props.onSelectItem(items.getOrThrow(index))
        }
    }, [items, activeItem])

    const visibleItems = items.filter((_, i) => i >= firstVisibleIndex && i <= lastVisibleIndex)

    return <AutocompleteOptions style={props.style} className={props.className + " column"}>
        {visibleItems.map((item, i) => <AutoCompleteItem typedWord={props.typedWord}
                                                         active={completionsEqual(activeItem, item)}
                                                         key={item.label + item.newText}
                                                         item={item.label}
                                                         onLeftClick={(e) => {
                                                             // Don't lose focus in the text field
                                                             e.preventDefault()
                                                             props.onSelectItem(item)
                                                         }}/>)}
        {props.isLoading && <CircularProgress style={{alignSelf: "center"}}/>}
    </AutocompleteOptions>
}


function AutoCompleteItem(props: {
    className?: string,
    item: string,
    onLeftClick: MouseEventHandler<HTMLSpanElement>,
    active: boolean,
    typedWord: string
}) {
    const theme = useTheme()
    const {before, typed, after} = breakDownItemIntoTypedAndNonTyped(props.item, props.typedWord)

    return <span style={{
        cursor: "pointer",
        backgroundColor: props.active ? theme.custom.selectedCompletionBackground : undefined
    }}
                 onMouseDown={(e) => {
                     if (e.button === LeftClick) props.onLeftClick(e)
                 }}>
        {before}
        {/*Highlight the typed value in blue*/}
        <span style={{color: theme.palette.primary.main, padding: 0}}>{typed}</span>
        {after}
    </span>
}

const LeftClick = 0

/**
 * For example, given completion item 'Hello', and typed 'el', it will return {before: 'H', typed: 'el', after: 'lo'}
 * This is a generic solution designed to make it so no matter what logic the completables use to showing thing, the 'typed' part will always make sense.
 * More improvements can be made to perhaps split into more parts in case the typed part is scattered through the word.
 */
function breakDownItemIntoTypedAndNonTyped(item: string, typedWord: string):
    { before: string, typed: string, after: string } {
    const index = item.toLowerCase().indexOf(typedWord.toLowerCase())
    // TypedWord is not identified in item: just display everything normally
    if (index === -1) return {before: item, typed: "", after: ""}
    return {before: item.slice(0, index), typed: item.slice(index,index + typedWord.length), after: item.slice(index + typedWord.length)}
}

const AutocompleteOptions = styled("div")(
    ({theme}) => `
    background-color: ${theme.custom.secondaryBackground};
    display: flex;
    flex-direction: column;
    
    border: 1px solid ${theme.custom.secondaryBackgroundBorder};
    margin-top: 1px;
    border-radius: 5px;
  *:not(:last-child) {
    border-bottom: 1px solid ${theme.custom.secondaryBackgroundSeparator};
  }
  * {
  padding: 5px;
  }
    `
)

