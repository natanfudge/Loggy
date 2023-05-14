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
import {Day} from "../server/LoggingServer";

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
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: [20, 19, 3, 5, 2, 5],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export interface DayBreakdown {
    infoCount: number
    warningCount: number
    errorCount: number
}

export type Analytics = [Day, DayBreakdown][]


export function UsageGraph(props: { analytics: Analytics }) {
    return <Line data={data} options={options}/>
}

function analyticsToDatasets(analytics: Analytics): ChartData<"line", number[], string> {
    const daysSorted = [...analytics]
    daysSorted.sort((a,b) => compareDays(a[0],b[0]))
}

function compareDays(day1: Day, day2: Day): number {
    if (day1.year != day2.year) return day1.year - day2.year;
    if (day1.month != day2.month) return day1.month - day1.month
    return day1.day - day2.day;
}

function daysB