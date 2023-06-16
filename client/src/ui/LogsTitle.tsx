import {Column, mapState, Row, State} from "../utils/Utils";
import {ThemeState} from "./App";
import {useScreenSize} from "../utils/ScreenSize";
import React, {Fragment, useCallback} from "react";
import styles from "./css/loggy.module.css";
import {CircularProgress, IconButton, styled} from "@mui/material";
import {Refresh, ShowChart} from "@mui/icons-material";
import {LoggySearchBar} from "./search/LoggySearchBar";
import {initialFilter} from "./Logs";
import {LogsQuery, ThemeSwitch} from "./Endpoint";
import { Dropdown } from "./UiUtils";
import {useNavigate} from "react-router-dom";

export function LogsTitle(props: {
    endpoints: string[] | undefined,
    query: State<LogsQuery>,
    onRefresh: () => void,
    theme: ThemeState
}) {
    const isPhone = useScreenSize().isPhone
    const query = props.query
    const endpoint = query.value.endpoint
    const queryString = query.value.query
    const onEndpointValueChange = useCallback((v: string) => query.onChange(({
        query: queryString,
        endpoint: v
    })), [queryString])

    const filterState = mapState(query, (q) => q.query, (filter) => ({endpoint, query: filter}))
    return <Row style={{padding: 10, paddingLeft: isPhone ? undefined : 30}}>

        <Column style={{paddingLeft: isPhone ? 10 : undefined, alignSelf: "center", width: isPhone?  "100%": undefined}}>
            <Row>
                <Row style={{alignItems: "center"}}>
                    {!isPhone && <span className={styles.logsForText}>
                        Logs for
                    </span>}
                    {/*When props.endpoints is defined, props.endpoint.value must also be defined*/}
                    {props.endpoints === undefined ? <CircularProgress/> :
                        <MaxWidthDropdown options={props.endpoints} value={endpoint!}
                                          onValueChanged={onEndpointValueChange}
                        />}


                </Row>
                <IconButton style={{height: "fit-content", alignSelf: "center", paddingLeft: 20}}
                            onClick={props.onRefresh}>
                    <Refresh/>
                </IconButton>
                {endpoint !== undefined && <PaddedStatsButton endpoint={endpoint}/>}
            </Row>
            {isPhone && <LoggySearchBar query={filterState}/>}
            {/*<NoticableDivider style={{marginTop: -1}}/>*/}
            {/*{isPhone && <FilterConfigSelection row={false} config={props.filter} setConfig={props.setFilter}/>}*/}
            {/*{isPhone && <TimeRangeSelector state={props.timeRange} row={true}/>}*/}
        </Column>


        {/*TODO: move somewhere else in mobile*/}


        {!isPhone && <Fragment>
            <LoggySearchBar query={filterState}/>
            {/*<FilterConfigSelection row={true} config={props.filter} setConfig={props.setFilter}/>*/}
            <ThemeSwitch themeState={props.theme}/>
        </Fragment>}

        {/*{isPhone && <Fragment>*/}
        {/*    <TimeRangeSelector state={props.timeRange}/>*/}
        {/*{props.endpoint.value !== undefined && <StatsButton endpoint={props.endpoint.value}/>}*/}
        {/*</Fragment> }*/}


        {/*{screen.isPhone && }*/}
        {/*</Column>*/}
        {/*{}*/}
    </Row>
}

const MaxWidthDropdown = styled(Dropdown)`
  width: max-content;
`

const PaddedStatsButton = styled(StatsButton)`
  padding-right: 20px;
`

function StatsButton(props: { endpoint: string, className?: string }) {
    const navigate = useNavigate()
    return <IconButton className={props.className} style={{marginLeft: 20, height: "min-content", alignSelf: "center"}}
                       onClick={() => navigate(`/logs/${props.endpoint}/stats`)}>
        <ShowChart/>
    </IconButton>
}

