import {usePromise} from "../utils/Utils";
import {LoggingServer} from "../server/LoggingServer";
import {Day} from "../core/Day";
import {AnalyticsGraph} from "./AnalyticsGraph";
import {CircularProgress} from "@mui/material";

export function AnalyticsUI(props: { endpoint: string }) {
    const analytics = usePromise(LoggingServer.getAnalytics(props.endpoint, new Day({
        day: 10,
        month: 5,
        year: 2023
    }), new Day({day: 15, month: 5, year: 2023})), [])

    if (analytics !== undefined) {
        return <AnalyticsGraph analytics={analytics}/>
    } else {
        return <CircularProgress/>
    }
}