import {CSSProperties, memo, useCallback, useEffect} from "react";
import {FormControl, InputLabel, NativeSelect} from "@mui/material";

export const Dropdown = memo(DropdownImpl)
 function DropdownImpl({label, options,value,onValueChanged, className}: {label?: string, options: string[], value: string, onValueChanged: (value: string) => void, className? :string}){
    useEffect(() => {
        if(!options.includes(value)) throw new Error(`Invalid dropdown value: ${value}. Possible values: ${options}.`)
    },[options,value])
    //
    // const onChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    //     onValueChanged(e.target.value)
    // },[])


     const onChange =    (e: React.ChangeEvent<HTMLSelectElement>) => {
         onValueChanged(e.target.value)
     }

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