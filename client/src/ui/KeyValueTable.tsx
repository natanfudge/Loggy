import {Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow} from "@mui/material";
import React from "react";
import {recordToArray} from "fudge-lib/dist/methods/Javascript";


export type StringMap = Record<string,string>

export function KeyValueTable({details}: { details: StringMap }) {
    return <TableContainer component={Paper} style={{height: "fit-content", width: "unset"}}>
        <Table>
            <TableBody>
                {recordToArray(details, (name, detail) => {
                    return <StyledTableRow key={name}>
                        <LeftmostStyledTableCell>{name}</LeftmostStyledTableCell>
                        <RightmostStyledTableCell>{String(detail)}</RightmostStyledTableCell>
                    </StyledTableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}

export const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
export const LeftmostStyledTableCell = styled(StyledTableCell)(({theme}) => ({
    borderRight: `1px solid ${theme.palette.primary.main}`,
    whiteSpace: "nowrap",
}));

export const RightmostStyledTableCell = styled(StyledTableCell)`
    line-break: anywhere
`

export const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        borderBottom: 0,

    },
}));
