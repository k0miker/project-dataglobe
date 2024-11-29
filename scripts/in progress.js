import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFilePath = path.join(__dirname, 'sterblichkeit_ext.json');
const newDataFilePath = path.join(__dirname, 'schulden.json'); // Beispiel für eine neue Datenquelle

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('schulden: ', (newValueName) => {
    fs.readFile(outputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der erweiterten Sterblichkeitsdaten:', err);
            rl.close();
            return;
        }

        const extendedMortalityData = JSON.parse(data);

        fs.readFile(newDataFilePath, 'utf8', (err, newData) => {
            if (err) {
                console.error('Fehler beim Lesen der neuen Daten:', err);
                rl.close();
                return;
            }

            const newValues = JSON.parse(newData);

            for (const [countryCode, newValue] of Object.entries(newValues)) {
                if (extendedMortalityData[countryCode]) {
                    extendedMortalityData[countryCode][newValueName] = newValue;
                } else {
                    console.log(`Keine erweiterten Daten für ${countryCode} gefunden.`);
                }
            }

            fs.writeFile(outputFilePath, JSON.stringify(extendedMortalityData, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Fehler beim Schreiben der erweiterten Sterblichkeitsdaten:', err);
                    rl.close();
                    return;
                }
                console.log('Erweiterte Sterblichkeitsdaten erfolgreich aktualisiert.');
                rl.close();
            });
        });
    });
});
