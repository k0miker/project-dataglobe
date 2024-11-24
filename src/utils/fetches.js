import axios from "axios";

// Länder abrufen und sortieren
export const fetchCountries = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    return response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error("Fehler beim Abrufen der Länder:", error);
    throw error;
  }
};

// GeoJSON Daten abrufen
export const fetchGeoJson = async () => {
  try {
    const response = await fetch("/ne_110m_admin_0_countries.geojson");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
};

export const fetchLocationData = async () => {
  try {
    const response = await fetch("/countries.csv")
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return

      response.text();
     
  }

  catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
}

export const fetchWorldBankData = async () => {
  try {
    const response = await axios.get("https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json");
    return response.data[1]; // Die Daten befinden sich im zweiten Element des Arrays
  } catch (error) {
    console.error("Fehler beim Abrufen der Weltbankdaten:", error);
    throw error;
  }
};

// bip worldbank data mit den lan log von den den locationdata combieniert in einen state speichern