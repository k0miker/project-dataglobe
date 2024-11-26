import axios from "axios";

// Länder abrufen und sortieren
export const fetchCountries = async () => {
  try {
    console.log("Fetching countries data...");
    const response = await fetch("/restcountriesData.json");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const data = await response.json();
    console.log("Countries data fetched successfully.");
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error("Fehler beim Abrufen der Länder:", error);
    throw error;
  }
};

// GeoJSON Daten abrufen
export const fetchGeoJson = async () => {
  try {
    console.log("Fetching GeoJSON data...");
    const response = await fetch("/ne_110m_admin_0_countries.geojson");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    console.log("GeoJSON data fetched successfully.");
    return response.json();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
};

export const fetchLocationData = async () => {
  try {
    console.log("Fetching location data...");
    const response = await fetch("/countries.csv");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    console.log("Location data fetched successfully.");
    return response.text();     
  }

  catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
}

export const fetchGDPDataForCountries = async () => {
  try {
    console.log("Fetching GDP data...");
    const response = await fetch("/extendedGdpData.json");
    const gdpData = await response.json();
    console.log("GDP data fetched successfully.");
    return gdpData;
  } catch (error) {
    console.error("Fehler beim Abrufen der erweiterten GDP-Daten:", error);
    throw error;
  }
};