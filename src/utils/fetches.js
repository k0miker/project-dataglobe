import axios from "axios";

// Länder abrufen und sortieren
export const fetchCountries = async () => {
  try {
    const response = await fetch("/restcountriesData.json");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const data = await response.json();
    // console.log("data: ", data);
    
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
    console.log("response: ", response);
    
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

export const fetchGDPDataForCountries = async (countries) => {
  try {
    const response = await fetch("/extendedGdpData.json");
    const extendedGdpData = await response.json();
    const gdpData = countries.map(country => {
      const { gdp, latitude, longitude } = extendedGdpData.country.cca2[gdp, latitude, longitude] || {};
      return {
        country: country.cca2,
        gdp: gdp || null,
        latitude: latitude ? parseFloat(latitude.replace(',', '.')) : null,
        longitude: longitude ? parseFloat(longitude.replace(',', '.')) : null
      };
    }).filter(data => data.gdp !== null && data.latitude !== null && data.longitude !== null);
    return gdpData;
  } catch (error) {
    console.error("Fehler beim Abrufen der erweiterten GDP-Daten:", error);
    throw error;
  }
};