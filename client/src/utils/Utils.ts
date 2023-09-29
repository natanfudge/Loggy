import {Dayjs, isDayjs} from "dayjs";


export function millsecondTimeToString(date: Dayjs): string {
    return `${timeToString(date)}:${threeChars(date.millisecond())}`
}


export function timeToString(date: Dayjs): string {
    if (!isDayjs(date)) {
        throw new Error(`Unexpected type of date: ${date} of type ${typeof date}`)
    }
    return `${simpleTimeToString(date)}:${twoChars(date.second())}`
}

export function simpleTimeToString(date: Dayjs): string {
    return `${twoChars(date.hour())}:${twoChars(date.minute())}`
}

export function twoChars(number: number): string {
    const str = String(number)
    if (str.length === 1) return `0${str}`
    else return str.substring(str.length - 2, str.length)
}

export function threeChars(number: number): string {
    const str = String(number)
    if (str.length === 1) return `00${str}`
    if (str.length === 2) return `0${str}`
    else return str
}


export function addAlphaToColor(color: string, alpha: number): string {
    if (color === "") return '';
    if (!color.startsWith('#')) return color;

    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


export function unixMs(date: Dayjs): number {
    return date.unix() * 1000 + date.millisecond()
}