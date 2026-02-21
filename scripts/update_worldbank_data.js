import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zielordner für die JSON-Dateien
const PUBLIC_DIR = path.join(__dirname, '../public');

// Konfiguration der Weltbank-Indikatoren
const WORLD_BANK_INDICATORS = {
  'schulden.json': 'GC.DOD.TOTL.GD.ZS', // Central government debt, total (% of GDP)
  'sterblichkeit.json': 'SP.DYN.CDRT.IN', // Death rate, crude (per 1,000 people)
  'inflation.json': 'FP.CPI.TOTL.ZG', // Inflation, consumer prices (annual %)
  'employment.json': 'SL.UEM.TOTL.ZS', // Unemployment, total (% of total labor force)
  'health.json': 'SP.DYN.LE00.IN', // Life expectancy at birth, total (years)
  'wachstum.json': 'NY.GDP.MKTP.KD.ZG', // GDP growth (annual %)
  'bildung.json': 'SE.XPD.TOTL.GD.ZS' // Government expenditure on education, total (% of GDP)
};

// Hilfsfunktion zum Abrufen von Weltbank-Daten
async function fetchWorldBankData(indicator) {
  // Wir holen Daten für das Jahr 2022 (meistens die aktuellsten vollständigen Daten)
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=300&date=2022`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Die Weltbank API gibt ein Array zurück: [Metadaten, Daten-Array]
    if (!data[1]) return [];

    // Formatieren in das Format, das deine App erwartet
    return data[1]
      .filter(item => item.countryiso3code) // Nur echte Länder (keine Regionen wie "World")
      .map(item => ({
        cca2: item.countryiso3code.substring(0, 2), // Weltbank nutzt ISO3, wir brauchen oft ISO2 (oder wir lassen es so, wenn deine App ISO3 kann)
        cca3: item.countryiso3code,
        data: item.value !== null ? { value: item.value } : "data not available"
      }));
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
