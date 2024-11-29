import { promises as fs } from 'fs';
import fetch from 'node-fetch';

const data = await fs.readFile("../public/countries.csv", "utf-8");

const indicators = {
    schulden: "GC.DOD.TOTL.GD.ZS",
    inflation: "FP.CPI.TOTL",
    unemployment: "SL.UEM.TOTL.ZS",
    lebenserwartung: "SP.DYN.LE00.IN",
    bildung: "SE.XPD.TOTL.GD.ZS",
    gesundheit: "SH.XPD.CHEX.GD.ZS",
    wirtschaftswachstum: "NY.GDP.MKTP.KD.ZG",
    armut: "SP.POP.TOTL",
    hunger: "SN.ITK.DEFC.ZS",
    wasser: "SH.H2O.SAFE.ZS",
    luft: "EN.ATM.PM25.MC.M3",
    klima: "EN.ATM.CO2E.PC",
    energie: "EG.USE.PCAP.KG.OE",
    co2: "EN.ATM.CO2E.KT"
};

const countries = data.split("\n").slice(1).map(row => row.split("\t")[0]);

const fetchCountryData = async (cca2, indicator) => {
    const url2023 = `https://api.worldbank.org/v2/country/${cca2}/indicator/${indicator}?date=2023&format=json`;
    const url2022 = `https://api.worldbank.org/v2/country/${cca2}/indicator/${indicator}?date=2022&format=json`;

    let response = await fetch(url2023);
    let result = await response.json();

    if (!result[1] || !result[1][0] || result[1][0].value === null) {
        response = await fetch(url2022);
        result = await response.json();
    }

    return { cca2, data: result };
};

const fetchAllCountriesData = async () => {
    const results = [];
    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        console.log(`Fetching data for ${country} (${i + 1}/${countries.length})`);
        const countryData = await fetchCountryData(country, indicators.schulden);
        let countryInfo;
        if (countryData.data && countryData.data[1] && countryData.data[1][0] && countryData.data[1][0].value) {
            countryInfo = {
                cca2: countryData.cca2,
                data: countryData.data[1][0]
            };
        } else {
            countryInfo = {
                cca2: countryData.cca2,
                data: "data not available"
            };
        }
        results.push(countryInfo);
    }
    console.log("data fetched:", results);
    await fs.writeFile("./neuedaten.json", JSON.stringify(results, null, 2));
    console.log("Data written to neuedaten.json");
};

fetchAllCountriesData();
