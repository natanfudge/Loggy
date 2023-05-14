import dayjs, {Dayjs} from "dayjs";

// export function dayJsToDay(dayjs: Dayjs): Day {
//
// }

// export function startOfDay(day: Day): Dayjs {
//     return dayjs({year: day.year, month: day.month - 1, day: day.day})
// }

// export function endOfDay(day: Day): Dayjs {
//
// }
export class Day {
    // 1-indexed
    readonly day: number
    // 1-indexed
    readonly month: number
    readonly year: number

    // constructor(day: number, month: number, year: number) {
    //     this.day = day;
    //     this.month = month;
    //     this.year = year;
    // }
    constructor({day,month,year}:{day: number, month: number, year: number}) {
        this.day = day;
        this.month = month;
        this.year = year;
    }

    dayString(): string {
        return this.day < 10? `0${this.day}`: String(this.day);
    }
    monthString(): string {
        return this.month < 10? `0${this.month}`: String(this.month);
    }

    /**
     * In european/israeli format
     */
    dateString(): string {
        return `${this.dayString()}/${this.monthString()}`
    }

    public static ofDate(dayjs: Dayjs): Day {
        const utc = dayjs.utc()
        return new Day({
            day: utc.date(),
            month: utc.month() + 1,
            year: utc.year()
        })
    }

    start(): Dayjs {
        return dayjs.utc({year: this.year, month: this.month - 1, day: this.day})
    }

    end(): Dayjs {
        return dayjs.utc({
            year: this.year,
            month: this.month - 1,
            day: this.day,
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 999
        })
    }
}
