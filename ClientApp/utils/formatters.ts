import {isNil, join} from "ramda";


export function formatCurrencyAmount(amount: number | null, symbol: string | null) {
    if (amount === null || amount === undefined) return "";
    if (symbol == null || symbol == undefined) {
        return amount.toLocaleString();
    }
    else {       
            if (Math.sign(amount) >= 0) {
                return `${symbol} ${amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } else {
                var amt = Math.abs(amount);
                return `${symbol} (${amt.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })})`;
            }
    }
}

export function emptyWhenZero(num: number | null) {
    if (num === null || num === undefined || num == 0) return "";
    else {
        return `${num}`;
    }
}


export function inputNumberAsString(numAsString: string | null) {
    return (numAsString == '' || numAsString == null)? 0.00 : parseFloat(numAsString);
}

export function formatPercentage(number: number | null) {
    if (number == null) return ""
    else return `${number.toString()}%`;
}

export function formatPercentageFromDecimal(number: number | null) {
    if (number == null) return ""
    else return `${(number * 100).toFixed(0).toString()}%`;
}

export function capitalize(s: string) {
    return s[0].toUpperCase() + s.substring(1).toLowerCase();
}

export function ampersandCapitalize(s: string) {
    let segments = s.split('&');
    let capsegments = segments.map(seg => capitalize(seg.trim()));
    return join(' & ', capsegments);
}


export function unitConversion(n: number | null | undefined, unit: string, precision?: number, factor?: number, altunit?: string, altprecision?: number) {
    if (isNil(n)) return "";
    precision = (precision != undefined)? precision : 2;
    let altnumber = factor != undefined? n * factor : undefined;
    let formatted = `${n.toFixed(precision)} ${unit}`;
    if (altnumber && altunit) {
        formatted = formatted + ` (${altnumber.toFixed(altprecision)} ${altunit})`
    }
    return formatted;
}
