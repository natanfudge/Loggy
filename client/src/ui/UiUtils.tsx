import {CSSProperties, useEffect} from "react";
import {FormControl, InputLabel, NativeSelect} from "@mui/material";

export function Dropdown({label, options,value,onValueChanged, style}: {label?: string, options: string[], value: string, onValueChanged: (value: string) => void, style?: CSSProperties}){
    useEffect(() => {
        if(!options.includes(value)) throw new Error(`Invalid dropdown value: ${value}. Possible values: ${options}.`)
    },[options,value])

    return <FormControl style = {style}>
        <InputLabel variant="standard">
            {label}
        </InputLabel>
        <NativeSelect
            value={value}
            onChange = {(e) => onValueChanged(e.target.value as string)}
        >
            {options.map((option) => <option key= {option} value = {option}>{option}</option>)}
        </NativeSelect>
    </FormControl>
}