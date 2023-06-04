import {CSSProperties, useCallback, useEffect} from "react";
import {FormControl, InputLabel, NativeSelect} from "@mui/material";

export function Dropdown({label, options,value,onValueChanged, className}: {label?: string, options: string[], value: string, onValueChanged: (value: string) => void, className? :string}){
    useEffect(() => {
        if(!options.includes(value)) throw new Error(`Invalid dropdown value: ${value}. Possible values: ${options}.`)
    },[options,value])

    const onChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onValueChanged(e.target.value)
    },[])

    return <FormControl className={className}>
        <InputLabel variant="standard">
            {label}
        </InputLabel>
        <NativeSelect
            value={value}
            onChange = {onChange}
        >
            {options.map((option) => <option key= {option} value = {option}>{option}</option>)}
        </NativeSelect>
    </FormControl>
}