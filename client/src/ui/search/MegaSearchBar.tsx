import {styled, TextField, useAutocomplete} from "@mui/material";
import {CSSProperties, Fragment, useRef, useState} from "react";
import {AutoComplete, Query, useAutoComplete} from "./Autocomplete";
import {AutocompleteController, Completeable, Completion, syncCompletable} from "./AutocompleteController";
import  "fudge-lib/dist/extensions/Extensions.js";
import {autocompleteConfig, autocompleteController} from "./Completables";

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

// const StyledMegaSearchBar = styled(MegaSearchBar)`
//   padding: 10px 50px;
// `



export function MegaSearchBar(props: { className?: string }) {
    const autocomplete = useAutoComplete(autocompleteConfig);
    // const [query, setQuery] = useState<Query>("")
    // const textAreaRef = useRef<HTMLInputElement>(null)
    // const caretPosition = AutoComplete.useCaretPosition(textAreaRef)
    // const results = autocompleteController.useResults(caretPosition, query)

    return <div className={props.className} style={{position: "relative", alignSelf: "center", width: "100%"}}>
        <TextField inputRef={autocomplete.ref} style={{width: "100%"}} autoComplete={"off"} value={autocomplete.query}
                   onChange={(e) => autocomplete.setQuery(e.target.value)}>

        </TextField>
        {/*Position the autocomplete in the exact caret position*/}
        {autocomplete.query !== "" && <OverlayedAutocompleteContent
            items={autocomplete.completions}
            style={{left: autocomplete.anchor}}
            onSelectItem={(completion) => autocomplete.complete(completion)}/>}
    </div>

}

const OverlayedAutocompleteContent = styled(AutocompleteContent)`
  position: absolute;
  margin-top: -15px;
  width: ${AutoComplete.WidthPx}px
`

export function AutocompleteContent(props: { className?: string, style: CSSProperties, items: Completion[], onSelectItem: (item: Completion) => void }) {
    if(props.items.isEmpty()) {
        return <Fragment/>
    }
    return <AutocompleteOptions style={props.style} className={props.className + " column"}>
        {props.items.map(item => <AutoCompleteItem key = {item.label} item = {item.label} onClick={() => props.onSelectItem(item)}/>)}
    </AutocompleteOptions>
}

function AutoCompleteItem(props: {className?: string, item: string, onClick: () => void}) {
    return <span style = {{cursor: "pointer"}} onClick={props.onClick} >{props.item}</span>
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

