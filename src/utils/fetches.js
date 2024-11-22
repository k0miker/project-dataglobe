
import axios from "axios";

export const fetchCountries = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    return response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error("Fehler beim Abrufen der Länder:", error);
    throw error;
  }
};

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