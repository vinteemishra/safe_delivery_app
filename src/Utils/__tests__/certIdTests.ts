import { countryInfo } from "../countries";
import moment from "moment";
import { createUniqueCertNumber, getInfo } from "../certId";

const countries = countryInfo.countries;

function randomDate(): Date {
    const start = new Date(2000, 0, 1);
    const end = new Date(2100, 0, 1);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

interface Country {
    key: string;
    name: string;
}
function randomCountry(): Country {
    var keys = Object.keys(countries);
    const key = keys[ keys.length * Math.random() << 0];
    const randCountry = countries[key];
    return { ...randCountry, key };
}

describe("random cert with random country / date", () => {
    const d = randomDate();
    const c = randomCountry();

    const certId = createUniqueCertNumber(c.key, d);
    const info = getInfo(certId);

    test("is valid", () => {
        expect(info.valid).toEqual(true)
    });

    test("date is equal (ISO)", () => {
        expect(info.date).toEqual(moment.utc(d).format("YYYY-MM-DD"));
    });
    test("country is equal (ISO)", () => {
        expect(info.country).toEqual(c.name);
    });
});


describe("Danish test", () => {
    const d = "2020-10-20";
    const c = "DK"

    const certId = createUniqueCertNumber(c, d);
    const info = getInfo(certId);

    test("is valid", () => {
        expect(info.valid).toEqual(true)
    });

    test("date is equal (ISO)", () => {
        expect(info.date).toEqual("2020-10-20");
    });
    test("country is equal (ISO)", () => {
        expect(info.country).toEqual("Denmark");
    });
});


describe("Ambigious centry must be in the 2000s", () => {
    const d = "2088-10-20";
    const c = "AZ"

    const certId = createUniqueCertNumber(c, d);
    const info = getInfo(certId);

    test("is valid", () => {
        expect(info.valid).toEqual(true)
    });

    test("date is equal", () => {
        expect(info.date).toEqual(d);
    });
});


describe("Invalid date is invalid", () => {
    const d = "2020-14-35";
    const c = "DK";

    const certId = createUniqueCertNumber(c, d);
    const info = getInfo(certId);

    test("is valid", () => {
        expect(info.valid).toEqual(false)
    });

    // TODO: Make sure country is kept

    test("date is equal (ISO)", () => {
        expect(info.date).toEqual("Invalid date");
    });
    test("country is equal (ISO)", () => {
        expect(info.country).toEqual("Denmark");
    });
});
