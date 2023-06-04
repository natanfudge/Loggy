import dayjs, {Dayjs} from "dayjs";


export class Day {
    // 1-indexed
    readonly day: number
    // 1-indexed
    readonly month: number
    readonly year: number


    constructor({day,month,year}:{day: number, month: number, year: number}) {
        this.day = day;
        this.month = month;
        this.year = year;
    }

    toString() : string {
        return `${this.dayString()}/${this.monthString()}/${this.yearString()}`
    }

    yearString(): string {
        return String(this.year).slice(2)
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

    public static today(): Day {
        return this.ofDate(dayjs())
    }
    public static beforeDays(days: number): Day {
        return this.ofDate(dayjs().subtract(days, 'days'))
    }

    public static ofUnixMs(unixMs: number): Day {
        if(typeof unixMs !== "number") throw new Error(`${unixMs} should be a number`)
        return this.ofDate(dayjs.utc(unixMs))
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
