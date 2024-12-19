import moment from "moment";
import { getRandomInt } from "./helpers";
import { countryInfo } from "./countries";

const CONTROL_NUMBER = "54491206714271"; // This is the "secret" Maternity control digits

const DEBUG = false;

/*
                      111 1
        0123 45 67 89 012 3
        RRRR-YY-MM-DD-CCC-K

        R = random number
        D = day
        M = month
        Y = year
        K = control digit

        sum modulo 11 == 0 -> valid
*/

function stringify(input: number | string, minLength = 0): string {
    const str = String(input);
    if (str.length < minLength) {
        let pad = "";
        for (let i = 0; i < minLength - str.length; i++) {
            pad += "0";
        }
        return `${pad}${str}`;
    }
    return str;
}

export interface Country {
    name: string;
    native: string;
    phone: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string;
    numeric: string;
}

export interface Countries {
    [key: string]: Country;
}

const countries: Countries = countryInfo.countries;
function getNumericCountryCode(countryCode: string): string {
    const country = countries[countryCode];
    if (country !== undefined) {
        return stringify(country.numeric);
    } else {
        return "000";
    }
}

function getCountryByNumeric(numericCode: string): Country | undefined {
    for (const code in countries) {
        if (Object.prototype.hasOwnProperty.call(countries, code)) {
            if (countries[code].numeric === numericCode) {
                return countries[code];
            }
        }
    }
    return undefined;
}

/*
              111 1
0123 45 67 89 012 3
RRRR-YY-MM-DD-CCC-K
*/

export interface CertIdInfo {
    valid: boolean;
    date: string;
    country: string;
}
export function getInfo(raw: string): CertIdInfo {
    const input = stringify(parseInt(raw.replace(/-/g, ""), 32), 14); // Convert from redix=32 to 10

    const datePart = input.slice(4,10);
    const countryCode = input.slice(10,13);

    const valid = validate(input, datePart);
    const date = moment.utc(`20${datePart}`, "YYYYMMDD").format("YYYY-MM-DD");
    const country = getCountryByNumeric(countryCode);

    return {
        valid,
        date,
        country: country ? country.name : "N/A",
    };
}

function modulo11(input: string, length: number) {
    const str = stringify(input, length);

    let sum = 0;
    for (let i = 0; i < length; i++) {
        let digit = Number(str[i]);
        let control = Number(CONTROL_NUMBER[i]);
        sum += digit * control;
        if (DEBUG) {
            console.log("digit:", digit, control, digit * control);
        }
    }

    if (DEBUG) {
        console.log(`modulo11:     ${sum} % 11 = ${sum % 11}  |  valid =`, sum % 11 === 0);
    }
    return sum % 11;
}

function validate(input: string, datePart: string) {
    const validDate = moment(`20${datePart}`).isValid();

    return modulo11(input, 14) === 0 && validDate;
}

function controlDigit(input: string) {
    const mod = modulo11(input, 13);

    if (mod === 0) {
        if (DEBUG) {
            console.log("ControlDigit", 0);
        }
        return 0;
    }
    if (DEBUG) {
        console.log("ControlDigit", 11 - mod);
    }
    return 11 - mod;
}

type DateInput = moment.MomentInput;
export function createUniqueCertNumber(countryCode: string, date: DateInput): string {
    const countryStr = getNumericCountryCode(countryCode);

    const momentDateStr = moment.utc(date).format("YYMMDD");
    const dateStr = momentDateStr === "Invalid date" ? "000000" : momentDateStr;

    let randomNumber: number;
    let control: number;
    let result: string;

    do {
        randomNumber = getRandomInt(1, 10000);
        result = `${randomNumber}${dateStr}${countryStr}`;
        control = controlDigit(result);

        if (DEBUG && control === 10) {
            console.log("***************** iterated new control ******************");
        }
    } while (control === 10);

    const resultNumber = Number(`${result}${control}`);
    if (DEBUG) {
        console.log("resultNumber", resultNumber);
    }
    const asString = resultNumber.toString(32).toUpperCase();
    const middle = Math.ceil(asString.length / 2);
    return `${asString.slice(0, middle)}-${asString.slice(middle)}`;
}
