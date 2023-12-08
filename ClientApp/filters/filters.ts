import moment from "moment";
import { browserLocale } from "../utils/utils"

export function dashify(value: string | null) {
    if (!value) {
        return '-';
    }
    else return value;
}


export function shortDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('L');
}

export function longDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('LLL');
}

export function monthAbbrevDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('D-MMM-YY').toUpperCase();
}

export function monthAbbrevDateTime(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('D-MMM-YY h:mm:ss A').toUpperCase();
}

export function monthAbbrevFullYearDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('D-MMM-YYYY').toUpperCase();
}

export function monthYearDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('MMM yyyy').toUpperCase();
}
export function yesno(value: boolean) {
    return value ? "Yes" : "No";
}

export function twoDecimals(value: number | null | undefined) {
    return value == null || value == undefined? "" : value.toFixed(2);
}

export function USLocalizedNumber(value: number | null | undefined) {
    return value == null || value == undefined? "" : value.toLocaleString('en-US');
}
