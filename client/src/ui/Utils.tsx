import React from "react";

export function Row(props: React.HTMLProps<HTMLDivElement>){
    return <div style = {{display: "flex", flexDirection: "row"}} {...props}  />
}
export function Column(props: React.HTMLProps<HTMLDivElement>){
    return <div style = {{display: "flex", flexDirection: "column"}} {...props}  />
}