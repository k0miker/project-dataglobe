import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countriesFilePath = path.join(__dirname, 'countries.csv');
const outputFilePath = path.join(__dirname, 'gdpData.json');

const fetchGDPData = async (countryCode) => {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&date=2023`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[1] && data[1][0] ? data[1][0].value : null;
    } catch (error) {
        console.error(`Fehler beim Abrufen der GDP-Daten für ${countryCode}:`, error);
        return null;
    }
};

const countries = [];

fs.createReadStream(countriesFilePath)
    .pipe(csv({ separator: '\t' }))
    .on('data', (row) => {
        countries.push(row);
    })
    .on('end', async () => {
        const gdpData = {};
        let processedCount = 0;

        for (const country of countries) {
            const gdpValue = await fetchGDPData(country.cca2);
            if (gdpValue !== null) {
                gdpData[country.cca2] = gdpValue;
                console.log(`GDP-Daten für ${country.name} (${country.cca2}): ${gdpValue}`);
            } else {
                console.log(`Keine GDP-Daten für ${country.name} (${country.cca2}) gefunden.`);
            }
            processedCount++;
            console.log(`Verarbeitet: ${processedCount}/${countries.length}`);
        }

        fs.writeFile(outputFilePath, JSON.stringify(gdpData, null, 2), 'utf8', err => {
            if (err) {
                console.error('Fehler beim Schreiben der Datei:', err);
                return;
            }
            console.log('GDP-Daten erfolgreich abgerufen und gespeichert.');
        });
    });