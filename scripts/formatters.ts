//import moment from "moment";
//import { browserLocale } from "../utils/utils"

 function dashify(value: string | null) {
    if (!value) {
        return '-';
    }
    else return value;
}



 function shortDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('L');
}

 function longDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('LLL');
}



function monthAbbrevDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).isValid() ? moment.utc(value).format('D-MMM-YY').toUpperCase() : value;
}

function monthAbbrevDateTime(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).isValid() ? moment.utc(value).format('D-MMM-YY h:mm:ss A').toUpperCase() : value;
}

function monthAbbrevFullYearDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('D-MMM-YYYY').toUpperCase();
}
 function monthYearDate(value: Date | null) {
    if (value == null) return null;
    return moment.utc(value).format('MMM yyyy').toUpperCase();
}
 function yesno(value: boolean) {
    return value ? "Yes" : "No";
}

 function twoDecimals(value: number | null | undefined) {
    return value == null || value == undefined ? "" : value.toFixed(2);
}

 function USLocalizedNumber(value: number | null | undefined) {
    return value == null || value == undefined ? "" : value.toLocaleString('en-US');
}