import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countriesFilePath = path.join(__dirname, 'countries.csv');
const gdpDataFilePath = path.join(__dirname, 'gdpData.json');
const outputFilePath = path.join(__dirname, 'extendedGdpData.json');

const countries = {};

fs.createReadStream(countriesFilePath)
    .pipe(csv({ separator: '\t' }))
    .on('data', (row) => {
        countries[row.cca2] = {
            latitude: row.latitude,
            longitude: row.longitude,
            name: row.name
        };
    })
    .on('end', () => {
        fs.readFile(gdpDataFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Fehler beim Lesen der GDP-Daten:', err);
                return;
            }

            const gdpData = JSON.parse(data);
            const extendedGdpData = {};

            for (const [countryCode, gdpValue] of Object.entries(gdpData)) {
                if (countries[countryCode]) {
                    extendedGdpData[countryCode] = {
                        gdp: gdpValue,
                        latitude: countries[countryCode].latitude,
                        longitude: countries[countryCode].longitude,
                        name: countries[countryCode].name
                    };
                } else {
                    console.log(`Keine Längen- und Breitengrad-Daten für ${countryCode} gefunden.`);
                }
            }

            fs.writeFile(outputFilePath, JSON.stringify(extendedGdpData, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Fehler beim Schreiben der erweiterten GDP-Daten:', err);
                    return;
                }
                console.log('Erweiterte GDP-Daten erfolgreich gespeichert.');
            });
        });
    });
