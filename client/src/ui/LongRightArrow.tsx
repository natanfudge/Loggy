import {CSSProperties} from "react";

export function LongRightArrow(props: {color?: string, style?: CSSProperties}) {
    const color = props.color ?? "#000000"
    const style = props.style ?? {}
    return <svg style = {style} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                x="0px" y="0px"
                viewBox="0 0 201.8 85.2"  xmlSpace="preserve">
        <polyline style = {{stroke: color, fill:"none",strokeWidth:7}} className="st0" points="163.1,2.8 197.1,42.8 163.1,82.8 "/>
        <line  style = {{stroke: color, fill:"none",strokeWidth:7}} className="st0" x1="0" y1="42.8" x2="195.3" y2="42.8"/>
</svg>

}