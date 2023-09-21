import {usePromise} from "../utils/Utils";
import {LoggingServer} from "../server/LoggingServer";
import {Day} from "../core/Day";
import {AnalyticsGraph} from "./AnalyticsGraph";
import {CircularProgress} from "@mui/material";
import {Fragment} from "react";
import {ThemeState, TimeRange} from "./App";
import dayjs from "dayjs";
import {ThemeSwitch, TimeRangeSelector} from "./Endpoint";
import styled from "@emotion/styled";
import {useScreenSize} from "../utils/ScreenSize";
import {useStateObject} from "../fudge-lib/state/State";

export function AnalyticsPage(props: { endpoint: string, theme: ThemeState }) {
    const timeRangeState = useStateObject<TimeRange>({startDay: dayjs().subtract(5, 'day'), endDay: dayjs()})
    const startDay = Day.ofDate(timeRangeState.value.startDay)
    const endDay = Day.ofDate(timeRangeState.value.endDay)
    const analytics = usePromise(LoggingServer.getAnalytics(props.endpoint, startDay, endDay), [startDay, endDay])
    const isPhone = useScreenSize().isPhone

    if (analytics !== undefined) {
        return <Fragment>
            <PositionedTimeRangeSelector state={timeRangeState} style = {{top: isPhone? undefined: 0, bottom: isPhone? 0: undefined}}/>
            <PositionedThemeSwitch themeState={props.theme} style = {{top: isPhone? undefined: 0, bottom: isPhone? 0: undefined}}/>
            <AnalyticsGraph analytics={analytics}/>
        </Fragment>
    } else {
        return <CircularProgress/>
    }
}

const PositionedTimeRangeSelector = styled(TimeRangeSelector)`
  position: absolute;
  right: 0;
  margin: 10px;
`

const PositionedThemeSwitch = styled(ThemeSwitch)`
  position: absolute;
  left: 0;
  margin: 10px;
`