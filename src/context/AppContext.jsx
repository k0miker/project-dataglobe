import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCountries, fetchGeoJson, fetchLocationData, fetchGDPDataForCountries, fetchEarthQuakes, fetchMortalityData } from "../utils/fetches";
import * as d3 from "d3";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.png");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataOption, setDataOption] = useState("gdp");
  const [showData, setShowData] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.2);
  const [visualizationType, setVisualizationTypeState] = useState("polygon");
  const [countries, setCountries] = useState([]);
  const [clouds, setClouds] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [gdpData, setGdpData] = useState([]);
  const [resize, setResize] = useState(false);
  const [showBorders, setShowBorders] = useState(false); // State für Länderumrisse
  const [colorScheme, setColorScheme] = useState("Reds");
  const [heatmapTopAltitude, setHeatmapTopAltitude] = useState(0.5);
  const [heatmapBandwidth, setHeatmapBandwidth] = useState(1.0);
  const [maxPolygonAltitude, setMaxPolygonAltitude] = useState(0.008);
  const [earthquakes, setEarthquakes] = useState([]); // Neuer State für die Erdbebendaten
  const [earthQuakeData, setEarthQuakeData] = useState([]);
  const [mortalityData, setMortalityData] = useState([]); // Neuer State für die Sterblichkeitsdaten

  // Visualisierungstyp ändern und Weltkarte entsprechend anpassen
  const setVisualizationType = (type) => {
    if (type === "heatmap") {
      setSelectedWorld("earthNight.jpg");
      setDataOption("population");
    } else if (type === "cable" || type === "CableGlobe") {
      setSelectedWorld("earthDark.png");
      setDataOption("cable");
    } else if (type === "polygon") {
      setDataOption("gdp");
    }
    setVisualizationTypeState(type);
  };

  const fetchData = async () => {
    try {
      // console.log("Fetching initial data...");
      const [geoJsonData] = await Promise.all([fetchGeoJson()]);

      const filteredGeoJsonData = geoJsonData.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      );
      // console.log("Filtered GeoJSON Data:", filteredGeoJsonData); // Log für gefilterte GeoJSON-Daten
      localStorage.setItem("geoJsonData", JSON.stringify(filteredGeoJsonData));
      setGeoJsonData(filteredGeoJsonData);

      // Fetch the rest of the data in the background
      const [countriesData, locationData] = await Promise.all([
        fetchCountries(),
        fetchLocationData(),
      ]);

      const gdpData = await fetchGDPDataForCountries(countriesData);
      // console.log("GDP Data:", gdpData); // Log für GDP-Daten
      setGdpData(gdpData);

      localStorage.setItem("countries", JSON.stringify(countriesData));
      localStorage.setItem("gdpData", JSON.stringify(gdpData));
      localStorage.setItem("locationData", locationData);

      setCountries(countriesData);
      // console.log("Initial data fetched successfully.");
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      // console.log("Fetching all data...");
      const [geoJsonData, countriesData, locationData, gdpData, mortalityData] = await Promise.all([
        fetchGeoJson(),
        fetchCountries(),
        fetchLocationData(),
        fetchGDPDataForCountries(),
        fetchMortalityData(), // Sterblichkeitsdaten abrufen
      ]);

      const filteredGeoJsonData = geoJsonData.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      );

      localStorage.setItem("geoJsonData", JSON.stringify(filteredGeoJsonData));
      setGeoJsonData(filteredGeoJsonData);

      localStorage.setItem("countries", JSON.stringify(countriesData));
      localStorage.setItem("gdpData", JSON.stringify(gdpData));
      localStorage.setItem("locationData", locationData);

      setCountries(countriesData);
      setGdpData(gdpData);
      
      const earthquakes = await fetchEarthQuakes(); // Erdbebendaten abrufen
      setEarthquakes(earthquakes); // Erdbebendaten setzen
      localStorage.setItem("earthquakes", JSON.stringify(earthquakes)); // Erdbebendaten im lokalen Speicher speichern
      
      setMortalityData(mortalityData); // Sterblichkeitsdaten setzen
      localStorage.setItem("mortalityData", JSON.stringify(mortalityData)); // Sterblichkeitsdaten im lokalen Speicher speichern

      console.log("All data fetched successfully.");
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  const fetchAndStoreEarthQuakeData = async () => {
    try {
      const data = await fetchEarthQuakes();
      // console.log("Fetched earthquake data:", data);
      setEarthQuakeData(data);
      localStorage.setItem('earthQuakeData', JSON.stringify(data));
    } catch (error) {
      console.error("Fehler beim Abrufen der Erdbebendaten:", error);
    }
  };

  // Daten beim Laden der Komponente abrufen oder aus dem lokalen Speicher laden
  useEffect(() => {
    // console.log("Fetching data on component mount...");
    const storedGeoJsonData = localStorage.getItem("geoJsonData");
    const storedCountries = localStorage.getItem("countries");
    const storedGdpData = localStorage.getItem("gdpData");
    const storedLocationData = localStorage.getItem("locationData");
    const storedEarthquakes = localStorage.getItem("earthquakes");
    const cachedData = localStorage.getItem('earthQuakeData');
    const storedMortalityData = localStorage.getItem("mortalityData");

    if (storedGeoJsonData) {
      setGeoJsonData(JSON.parse(storedGeoJsonData));
    } else {
      fetchData();
    }

    if (storedCountries && storedGdpData && storedLocationData) {
      setCountries(JSON.parse(storedCountries));
      setGdpData(JSON.parse(storedGdpData));
    } else {
      fetchData();
    }

    if (storedEarthquakes) {
      setEarthquakes(JSON.parse(storedEarthquakes));
    } else {
      fetchAllData();
    }

    if (cachedData) {
      // console.log("Using cached earthquake data:", JSON.parse(cachedData));
      setEarthQuakeData(JSON.parse(cachedData));
    } else {
      fetchAndStoreEarthQuakeData();
    }

    if (storedMortalityData) {
      setMortalityData(JSON.parse(storedMortalityData));
    } else {
      fetchAllData();
    }

    fetchAllData(); // Abrufen aller Daten beim Laden der Seite
  }, []);

  return (
    <AppContext.Provider value={{ 
      selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, 
      dataOption, setDataOption, showData, setShowData, rotationSpeed, 
      setRotationSpeed, visualizationType, setVisualizationType, countries, 
      clouds, setClouds, geoJsonData, gdpData, showBorders, setShowBorders, 
      colorScheme, setColorScheme, heatmapTopAltitude, setHeatmapTopAltitude, heatmapBandwidth, setHeatmapBandwidth, 
      maxPolygonAltitude, setMaxPolygonAltitude, 
      earthquakes, // Erdbebendaten im Kontext bereitstellen
      earthQuakeData, fetchAndStoreEarthQuakeData,
      mortalityData, // Sterblichkeitsdaten im Kontext bereitstellen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
