import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countriesFilePath = path.join(__dirname, 'countries.csv');
const mortalityDataFilePath = path.join(__dirname, 'sterblichkeit.json');
const outputFilePath = path.join(__dirname, 'sterblichkeit_ext.json');

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
        fs.readFile(mortalityDataFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Fehler beim Lesen der Sterblichkeitsdaten:', err);
                return;
            }

            const mortalityData = JSON.parse(data);
            const extendedMortalityData = {};

            for (const entry of mortalityData) {
                const countryCode = entry.cca2;
                if (countries[countryCode]) {
                    extendedMortalityData[countryCode] = {
                        value_: entry.data.value || "no data",
                        latitude: countries[countryCode].latitude,
                        longitude: countries[countryCode].longitude,
                        name: countries[countryCode].name
                    };
                } else {
                    console.log(`Keine Längen- und Breitengrad-Daten für ${countryCode} gefunden.`);
                }
            }

            fs.writeFile(outputFilePath, JSON.stringify(extendedMortalityData, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Fehler beim Schreiben der erweiterten Sterblichkeitsdaten:', err);
                    return;
                }
                console.log('Erweiterte Sterblichkeitsdaten erfolgreich gespeichert.');
            });
        });
    });
