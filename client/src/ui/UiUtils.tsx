import {CSSProperties, memo, useEffect} from "react";
import {FormControl, InputLabel, NativeSelect} from "@mui/material";
import { State } from "../fudge-lib/state/State";

export const Dropdown = memo(DropdownImpl)

function DropdownImpl({label, options, state, className, style}: {
    label?: string,
    options: string[],
    state: State<string>,
    className?: string,
    style?: CSSProperties
}) {
    const {value, setValue} = state;
    useEffect(() => {
        if (!options.includes(value)) throw new Error(`Invalid dropdown value: ${value}. Possible values: ${options}.`)
    }, [options, value])

    return <FormControl className={className}>
        <InputLabel variant="standard">
            {label}
        </InputLabel>
        <NativeSelect
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style = {style}
        >
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </NativeSelect>
    </FormControl>
}