import {ThemeState} from "./App";
import React, {Fragment, useCallback} from "react";
import styles from "./css/loggy.module.css";
import {CircularProgress, IconButton, styled} from "@mui/material";
import {Refresh, ShowChart} from "@mui/icons-material";
import {LoggySearchBar} from "./LoggySearchBar";
import {EndpointQuery, ThemeSwitch} from "./Endpoint";
import {Dropdown} from "./UiUtils";
import {useNavigate} from "react-router-dom";
import {Column, Row} from "../fudge-lib/Flow";
import {State} from "../fudge-lib/state/State";
import {Endpoint, endpointFromString, endpointToString} from "../model/Endpoint";
import {useScreenSize} from "../fudge-lib/methods/Gui";
export function LogsTitle(props: {
    endpoints: Endpoint[] | undefined,
    endpointQuery: State<EndpointQuery>,
    queryError: string | undefined,
    onRefresh: () => void,
    theme: ThemeState
}) {
    const isPhone = useScreenSize().isPhone
    const query = props.endpointQuery
    const endpoint = query.value.endpoint

    const queryState = query.field("query")
    const endpointState = query.field("endpoint")
        .mapType(endpoint => endpointToString(endpoint), string => endpointFromString(string))

    return <Row style={{paddingRight: 10, paddingTop: isPhone? 10: undefined, paddingLeft: isPhone ? undefined : 30}}>

        <Column
            style={{paddingLeft: isPhone ? 10 : undefined, alignSelf: "center", width: isPhone ? "100%" : undefined}}>
            <Row>
                <Row style={{alignItems: "center"}}>
                    {!isPhone && <span className={styles.logsForText}>
                        Logs for
                    </span>}
                    {/*When props.endpoints is defined, the endpoint value must also be defined*/}
                    {props.endpoints === undefined ? <CircularProgress/> :
                        <MaxWidthDropdown state = {endpointState} options={props.endpoints.map(endpoint => endpointToString(endpoint))}/>}

                </Row>
                <IconButton style={{height: "fit-content", alignSelf: "center", marginLeft: 20}}
                            onClick={props.onRefresh}>
                    <Refresh/>
                </IconButton>
                {endpoint !== undefined && <PaddedStatsButton endpoint={endpoint}/>}
            </Row>
            {isPhone && <LoggySearchBar query={queryState} error = {props.queryError}/>}
        </Column>


        {!isPhone && <Fragment>
            <LoggySearchBar query={queryState} error = {props.queryError}/>
            <ThemeSwitch themeState={props.theme}/>
        </Fragment>}
    </Row>
}

const MaxWidthDropdown = styled(Dropdown)`
  width: max-content;
`

const PaddedStatsButton = styled(StatsButton)`
  margin-right: 20px;
`

function StatsButton(props: { endpoint: Endpoint, className?: string }) {
    const navigate = useNavigate()
    return <IconButton className={props.className} style={{marginLeft: 20, height: "min-content", alignSelf: "center"}}
                       onClick={() => navigate(`/logs/${endpointToString(props.endpoint)}/stats`)}>
        <ShowChart/>
    </IconButton>
}

