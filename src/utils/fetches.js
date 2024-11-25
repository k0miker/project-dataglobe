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
  const gdpData = [];
  for (const country of countries) {
    const url = `https://api.worldbank.org/v2/country/${country.cca2}/indicator/NY.GDP.MKTP.CD?format=json&date=2023`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log("data: ", data);
      
      if (Array.isArray(data[1]) && data[1].length > 0) {
        gdpData.push({
          country: country.cca2,
          gdp: data[1][0].value
        });
      }
    } catch (error) {
      console.error(`Fehler beim Abrufen der GDP-Daten für ${country.cca2}:`, error);
    }
  }
  return gdpData;
};