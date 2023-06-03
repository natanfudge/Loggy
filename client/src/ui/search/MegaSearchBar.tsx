import {styled, TextField, useTheme} from "@mui/material";
import {CSSProperties, Fragment, MouseEventHandler, useEffect, useState} from "react";
import {AutoCompleteWidthPx, useAutoComplete} from "./Autocomplete";
import "fudge-lib/dist/extensions/Extensions.js";
import {autocompleteConfig} from "./Completables";
import {Completion} from "./AutocompleteConfig";
import {useKeyboardShortcut} from "../../utils-proposals/DomUtils";

// TODO: implement and style typed completion part - text of all completions

export function MegaSearchBarTest() {
    return <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{padding: "10px 200px"}}>
            <MegaSearchBar/>
        </div>

        <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium ad alias, architecto doloremque
            doloribus, earum expedita fuga nisi optio perspiciatis quis rerum vitae. Assumenda cupiditate debitis
            ducimus, est eveniet facere facilis illo molestiae nam nobis. Assumenda ducimus earum eligendi fugiat illum
            iste libero, molestiae natus possimus recusandae vitae voluptatem.
        </div>
    </div>
}


export function MegaSearchBar(props: { className?: string }) {
    const autocomplete = useAutoComplete(autocompleteConfig);


    return <div className={props.className} style={{position: "relative", alignSelf: "center", width: "100%"}}>
        <TextField inputRef={autocomplete.ref} style={{width: "100%"}} autoComplete={"off"} value={autocomplete.query}
                   onChange={(e) => autocomplete.setQuery(e.target.value)}
                   onFocus={autocomplete.show} onBlur={autocomplete.hide} spellCheck={false}
        >

        </TextField>
        {/*Position the autocomplete in the exact caret position*/}
        <OverlayedAutocompleteContent
            items={autocomplete.completions}
            style={{left: autocomplete.anchor}}
            onSelectItem={(completion) => autocomplete.complete(completion)}/>
    </div>

}

const OverlayedAutocompleteContent = styled(AutocompleteContent)`
  position: absolute;
  margin-top: -15px;
  width: ${AutoCompleteWidthPx}px
`


export function AutocompleteContent(props: {
    className?: string,
    style: CSSProperties,
    items: Completion[],
    onSelectItem: (item: Completion) => void
}) {
    if (props.items.isEmpty()) {
        return <Fragment/>
    }
    return NonEmptyAutocompleteContent(props);
}

function NonEmptyAutocompleteContent(props: {
    className?: string;
    style: React.CSSProperties;
    items: Completion[];
    onSelectItem: (item: Completion) => void
}) {
    const labels = props.items.map(i => i.label)
    const [activeItem, setActiveItem] = useState<string>(labels[0])
    //TODO: handle identical labels

    useEffect(() => {
        if (!labels.includes(activeItem)) setActiveItem(labels[0])
    }, [labels])

    // Go down in selection when down is pressed
    useKeyboardShortcut("ArrowDown", () => {
        setActiveItem(old => {
            const index = labels.indexOfOrThrow(old)
            if (index < props.items.length - 1) return labels[index + 1]
            else return old
        })
    },[])

    // Go up in selection when up is pressed
    useKeyboardShortcut("ArrowUp", () => {
        setActiveItem(old => {
            const index = labels.indexOfOrThrow(old)
            if (index > 0) return labels[index - 1]
            else return old
        })
    },[])

    useKeyboardShortcut("Enter", () => {
        const index = labels.indexOfOrThrow(activeItem)
        props.onSelectItem(props.items[index])
    },[activeItem])

    return <AutocompleteOptions style={props.style} className={props.className + " column"}>
        {props.items.map((item, i) => <AutoCompleteItem active={activeItem === item.label} key={item.label}
                                                        item={item.label}
                                                        onMouseDown={(e) => {
                                                            // Don't lose focus in the text field
                                                            e.preventDefault()
                                                            props.onSelectItem(item)
                                                        }}/>)}
    </AutocompleteOptions>
}


function AutoCompleteItem(props: {
    className?: string,
    item: string,
    onMouseDown: MouseEventHandler<HTMLSpanElement>,
    active: boolean
}) {
    const theme = useTheme()
    return <span style={{
        cursor: "pointer",
        backgroundColor: props.active ? theme.custom.selectedCompletionBackground : undefined
    }}
                 onMouseDown={props.onMouseDown}>{props.item}</span>
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

