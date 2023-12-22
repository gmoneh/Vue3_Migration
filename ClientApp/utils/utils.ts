import { isNil, reduce } from "ramda";
import moment from "moment";

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toQueryString(o: {[k: string]: any})
{
    let addToQstring = (qstring: string, k: string) => qstring.concat(!isNil(o[k])? `${k}=${encodeURIComponent(o[k])}` : "", '&');
    return reduce(addToQstring, <string>"", Object.keys(o));
}


export function stringListToHtml(stringOrList: string | string[]) {
    if (Array.isArray(stringOrList)) {
        return stringOrList.reduce((prev, current, idx) => `${prev}${idx > 0? '<br/>' : ''}${current}`, '');
    }
    else return stringOrList;
}

export function convertDate(s?: string | null) {
    if (!s) return null;
    let sWithTimeZone = /T\d{2}:\d{2}:\d{2}/.test(s)? `${s}+00:00` : s;
    return new Date(sWithTimeZone);
}

export function dateToInputDateString(d: Date | null) {
    if (!d) return null;
    let m = moment.utc(d);
    m.utcOffset(0)
    return m.format("YYYY-MM-DD");
}

export function browserLocale() {
    if (navigator.languages != undefined)
        return navigator.languages[0];
    else
        return navigator.language;
}

export function remToPixels(rem: number) {  
    let fontSize = getComputedStyle(document.documentElement)!.fontSize;
    if (fontSize == null) fontSize = "16";
    return rem * parseFloat(fontSize);
}

export function validate_keypress_chars(keyValue: string, chars: string) {
    return chars.indexOf(keyValue) > -1;
}

export function validate_keypress_not_alphanumeric(keyCode: number ) {
    return  (!(keyCode > 47 && keyCode < 58)) && // numeric (0-9)
    (!(keyCode > 64 && keyCode < 91)) && // upper alpha (A-Z)
    (!(keyCode > 96 && keyCode < 123)); // lower alpha (a-z)
}
