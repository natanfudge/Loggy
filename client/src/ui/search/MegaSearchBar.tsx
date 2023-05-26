import {styled, TextField} from "@mui/material";
import {CSSProperties, useRef, useState} from "react";
import {Query} from "./Autocomplete";
import {AutoComplete} from "./Autocomplete";

export function MegaSearchBarTest() {
    return <div style={{display: "flex", flexDirection: "column"}}>
        <div style = {{padding: "10px 200px"}}>
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

export function MegaSearchBar(props: {className?: string}) {
    const [query, setQuery] = useState<Query>("")
    const textAreaRef = useRef<HTMLInputElement>(null)
    const caretPosition = AutoComplete.useCaretPosition(textAreaRef)

    return <div className={props.className} style={{position: "relative", alignSelf: "center", width: "100%"}}>
        <TextField inputRef = {textAreaRef} style = {{width: "100%"}} autoComplete={"off"} value={query} onChange={(e) => setQuery(e.target.value)}>

        </TextField>
        {query !== "" && <OverlayedAutocompleteItems style = {{left: AutoComplete.anchor(caretPosition)}}/>}
    </div>

}

const OverlayedAutocompleteItems = styled(AutocompleteContent)`
  position: absolute;
  margin-top: -15px;
  width: ${AutoComplete.WidthPx}px
`

export function AutocompleteContent(props: { className?: string, style: CSSProperties }) {
    return <AutocompleteOptions style = {props.style} className={props.className + " column"}>
        <span>Option 1</span>
        <span>Option 2</span>
        <span>Option 3</span>
    </AutocompleteOptions>
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

