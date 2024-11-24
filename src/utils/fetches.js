import axios from "axios";

// Länder abrufen und sortieren
export const fetchCountries = async () => {
  try {
    const response = await fetch("/restcountriesData.json");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const data = await response.json();
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
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
    return response.text();     
  }

  catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
}

export const fetchWorldBankData = async () => {
  try {
    const response = await fetch("/gdpWBdata.json");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const data = await response.json();
    return data[1]; // Die Daten befinden sich im zweiten Element des Arrays
  } catch (error) {
    console.error("Fehler beim Abrufen der Weltbankdaten:", error);
    throw error;
  }
};

// bip worldbank data mit den lan log von den den locationdata combieniert in einen state speichern