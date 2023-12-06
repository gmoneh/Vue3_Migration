export function froalaKey(): string | null {
    var host = window.location.hostname.toLowerCase();
    if (host.indexOf("lightningsource.com") > 0) {
        return "yDC5hD4C2B10B5B4A3gptywtokmcvirzjoC6obcsF4I4A11C8C2C5G5B1E3I3==";
    }
    else if (host.indexOf("ingramspark.com") > 0) {
        return "SDB17hD9C4B5C3F3A2gusymalqsewmA6kfgwG1G1B2C1B1D7D6E1F4F4==";
    }
    else return null;
}
