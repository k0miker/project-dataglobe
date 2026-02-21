import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zielordner für die JSON-Dateien
const PUBLIC_DIR = path.join(__dirname, '../public');

// Konfiguration der Weltbank-Indikatoren
const WORLD_BANK_INDICATORS = {
  // Schulden: Versuche breitere Definition "Central government debt" ist oft lückenhaft. 
  // Alternativen prüfen wir unten im Code, aber 'GC.DOD.TOTL.GD.ZS' ist der Standard. 
  // Wir nutzen hier weiter diesen, füllen aber Lücken auf.
  'schulden.json': 'GC.DOD.TOTL.GD.ZS', 
  'sterblichkeit.json': 'SP.DYN.CDRT.IN', // Death rate, crude (per 1,000 people)
  'inflation.json': 'FP.CPI.TOTL.ZG', // Inflation, consumer prices (annual %)
  'employment.json': 'SL.UEM.TOTL.ZS', // Unemployment, total (% of total labor force)
  'health.json': 'SP.DYN.LE00.IN', // Life expectancy at birth, total (years)
  // Wachstum: Pro Kopf Wachstum ist oft stabiler verfügbar als aggregiertes
  'wachstum.json': 'NY.GDP.MKTP.KD.ZG', 
  'bildung.json': 'SE.XPD.TOTL.GD.ZS' 
};

// Hilfsfunktion: Lücken füllen (Linear Interpolation & Forward Filling)
function fillGaps(dataObj, startYear, endYear) {
  // Years as numbers, sorted
  const years = Object.keys(dataObj).map(Number).sort((a, b) => a - b);
  
  if (years.length === 0) return dataObj; // Keine Daten vorhanden

  const filled = { ...dataObj };
  
  // 1. Lücken zwischen vorhandenen Jahren interpolieren (Linear)
  for (let i = 0; i < years.length - 1; i++) {
    const currentYear = years[i];
    const nextYear = years[i + 1];
    const gapSize = nextYear - currentYear;
    
    // Nur Lücken bis zu 10 Jahren füllen, sonst ist es zu gewagt
    if (gapSize > 1 && gapSize <= 10) {
      const startVal = dataObj[currentYear];
      const endVal = dataObj[nextYear];
      const stepValue = (endVal - startVal) / gapSize;

      for (let j = 1; j < gapSize; j++) {
        filled[currentYear + j] = startVal + (stepValue * j);
      }
    }
  }

  // Rekalkuliere keys nach Interpolation
  const filledYears = Object.keys(filled).map(Number).sort((a, b) => a - b);
  const lastKnownYear = filledYears[filledYears.length - 1];
  const firstKnownYear = filledYears[0];
  const lastKnownValue = filled[lastKnownYear];
  const firstKnownValue = filled[firstKnownYear];

  // 2. Forward Filling (Zukunft): Lücken am Ende füllen (max 5 Jahre)
  // Wenn wir z.B. Daten bis 2018 haben, füllen wir bis 2023 auf.
  for (let y = lastKnownYear + 1; y <= endYear; y++) {
      filled[y] = lastKnownValue; 
  }

  // 3. Backward Filling (Vergangenheit): Lücken am Anfang füllen (max 10 Jahre)
  // Wenn Daten erst ab 1995 da sind, füllen wir rückwärts bis 1985 auf.
  for (let y = firstKnownYear - 1; y >= startYear; y--) {
      // Wir limitieren Backfilling nicht strikt auf 5 Jahre, 
      // sondern erlauben es großzügiger, damit der Slider nicht leer ist.
      // Aber wir stoppen, wenn wir zu weit weg sind (z.B. > 15 Jahre).
      if (firstKnownYear - y <= 15) {
          filled[y] = firstKnownValue;
      }
  }

  return filled;
}

// Hilfsfunktion zum Abrufen von Weltbank-Daten
async function fetchWorldBankData(indicator) {
  const startYear = 1960;
  const endYear = new Date().getFullYear();
  // Wir holen Daten für die Jahre 1960 bis heute
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=20000&date=${startYear}:${endYear}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (!data[1]) return [];

    const countryData = {};

    data[1].forEach(item => {
      if (!item.countryiso3code) return; 
      
      const cca3 = item.countryiso3code;
      const year = parseInt(item.date); // Jahr als Zahl
      const value = item.value;

      if (!countryData[cca3]) {
        countryData[cca3] = {
          cca2: cca3.substring(0, 2),
          cca3: cca3,
          data: {} // Hier speichern wir Rohdaten
        };
      }
      
      if (value !== null) {
        countryData[cca3].data[year] = value;
      }
    });

    // Nachbearbeitung: Lücken füllen für jedes Land
    const processedList = Object.values(countryData).map(country => {
        return {
            ...country,
            data: fillGaps(country.data, startYear, endYear)
        };
    });

    return processedList;
  } catch (error) {
    console.error(`Fehler beim Abrufen von ${indicator}:`, error);
    return [];
  }
}

async function updateAllData() {
  console.log('Starte Daten-Update...');

  for (const [filename, indicator] of Object.entries(WORLD_BANK_INDICATORS)) {
    console.log(`Lade Daten für ${filename} (Indikator: ${indicator})...`);
    const data = await fetchWorldBankData(indicator);
    
    if (data.length > 0) {
      const filePath = path.join(PUBLIC_DIR, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ ${filename} erfolgreich aktualisiert (${data.length} Einträge).`);
    } else {
      console.log(`❌ Keine Daten für ${filename} gefunden.`);
    }
  }

  console.log('Update abgeschlossen!');
}

updateAllData();
