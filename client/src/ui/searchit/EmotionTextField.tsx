import {ReactComponent} from "fudge-lib/dist/types/React";
import {Column, Row} from "fudge-lib/dist/Flow";
import {State} from "fudge-lib/dist/state/State";
import {useTheme} from "@emotion/react";
import styled from "@emotion/styled";

export function EmotionTextField(props: {error?: string, state: State<string>, leadingIcon?: ReactComponent}) {
    const theme = useTheme()
    console.log(`Surface color: ${theme.colors.surface}`)

    return <Column style = {{width: "100%"}}>
        {/*Balance the bottom placeholder text so the input will be centered*/}
        {PlaceHolderText("0.2rem")}
        <Row style = {{border: props.error !== undefined? `1px solid ${theme.colors.error}`: undefined,  width: "100%"}}>
            <ThemedInput value={props.state.value} onChange={e => props.state.setValue(e.target.value)}/>
        </Row>

        {/*Even if there is no error, have hidden text so the component won't enlargen when there's an error*/}
        {props.error === undefined? PlaceHolderText("0.2rem") :<span style={{color: theme.colors.error}}>{props.error}</span>}
    </Column>
}

function PlaceHolderText(fontSize: string) {
    return <span style={{visibility: "hidden", fontSize: fontSize}}>placeholder</span>
}

const ThemedInput = styled.input`
  height: 1.8rem;
  width: 100%;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 3px;
  color: ${props => props.theme.colors.text};
  padding: 1rem;
`