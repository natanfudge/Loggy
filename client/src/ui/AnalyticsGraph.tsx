import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Day} from "../core/Day";
import {Theme, useTheme} from "@mui/material";
import {HashMap} from "../fudge-lib/collections/hashmap/HashMap";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Call Breakdown by Day',
        },
    },
};

export interface DayBreakdown {
    infoCount: number
    warningCount: number
    errorCount: number
}

export type Analytics = [Day, DayBreakdown][]

const emptyBreakdown: DayBreakdown = {
    errorCount: 0,
    infoCount: 0,
    warningCount: 0
}


export function AnalyticsGraph(props: { analytics: Analytics }) {
    const theme = useTheme()
    return <Line style={{maxHeight: "100%", maxWidth: "100%"}} data={analyticsToDatasets(props.analytics, theme)} options={options}/>
}

function analyticsToDatasets(analytics: Analytics, theme: Theme): ChartData<"line", number[], string> {
    if (analytics.isEmpty()) return {labels: [], datasets: []}
    const daysSorted = [...analytics]
    daysSorted.sort((a, b) => compareDays(a[0], b[0]))
    const dayToBreakdown = HashMap.fromPairArray(daysSorted)
    const allDays = daysBetween(daysSorted.first()[0], daysSorted.last()[0])

    const labels = allDays.map(day => day.dateString())

    // This accounts for days with no data as well, giving them the value of 0.
    const allBreakdowns: DayBreakdown[] = allDays.map(day => dayToBreakdown.getOr(day, () => emptyBreakdown))

    const infoDataset = allBreakdowns.map(b => b.infoCount)
    const warnDataset = allBreakdowns.map(b => b.warningCount)
    const errorDataset = allBreakdowns.map(b => b.errorCount)

    return {
        labels: labels,
        datasets: [
            {
                label: 'Successful Calls',
                data: infoDataset,
                borderColor: theme.palette.text.primary ,
                backgroundColor: theme.palette.text.secondary,
            },
            {
                label: 'Warnings',
                data: warnDataset,
                borderColor: 'rgb(255,247,99)',
                backgroundColor: 'rgba(255,219,99,0.5)',
            },
            {
                label: 'Errors',
                data: errorDataset,
                borderColor: 'rgb(224,0,0)',
                backgroundColor: 'rgba(171,0,37,0.5)',
            },
        ]
    }
}

function compareDays(day1: Day, day2: Day): number {
    if (day1.year !== day2.year) return day1.year - day2.year;
    if (day1.month !== day2.month) return day1.month - day1.month
    return day1.day - day2.day;
}

/**
 * For example, between 28/04 to 03/05, it would return [28/04, 29/04, 30/04, 01/05, 02/05, 03/05]
 */
function daysBetween(start: Day, end: Day): Day[] {
    const startDayjs = start.start()
    const endDayjs = end.end()

    const days: Day[] = []
    let currentDay = startDayjs
    while (currentDay.isBefore(endDayjs)) {
        days.push(Day.ofDate(currentDay))
        currentDay = currentDay.add(1, 'day')
    }
    return days;
}