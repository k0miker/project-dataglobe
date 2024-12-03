import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCountries, fetchGeoJson, fetchLocationData, fetchGDPDataForCountries, fetchEarthQuakes, fetchMortalityData, fetchDebtData, fetchInflationData, fetchEmploymentData, fetchHealthData, fetchGrowthData } from "../utils/fetches";
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
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [gdpData, setGdpData] = useState([]);
  const [showBorders, setShowBorders] = useState(false); 
  const [colorScheme, setColorScheme] = useState("Blues");
  const [heatmapTopAltitude, setHeatmapTopAltitude] = useState(0.2);
  const [heatmapBandwidth, setHeatmapBandwidth] = useState(1.8);
  const [maxPolygonAltitude, setMaxPolygonAltitude] = useState(0.008);
  const [earthquakes, setEarthquakes] = useState([]); 
  const [earthQuakeData, setEarthQuakeData] = useState([]);
  const [mortalityData, setMortalityData] = useState([]); 
  const [debtData, setDebtData] = useState([]); 
  const [inflationData, setInflationData] = useState([]); 
  const [employmentData, setEmploymentData] = useState([]);
  const [healthData, setHealthData] = useState([]); 
  const [growthData, setGrowthData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [showGrid, setShowGrid] = useState(true);
  const [cableColorSet, setCableColorSet] = useState("default"); 

  // Visualisierungstyp ändern und Weltkarte entsprechend anpassen
  const setVisualizationType = (type) => {
    if (type === "heatmap") {
      setSelectedWorld("earthDark.png");
      setDataOption("population");
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
      const [geoJsonData, countriesData, locationData, gdpData, mortalityData, debtData, inflationData, employmentData, healthData, growthData] = await Promise.all([
        fetchGeoJson(),
        fetchCountries(),
        fetchLocationData(),
        fetchGDPDataForCountries(),
        fetchMortalityData(), 
        fetchDebtData(), 
        fetchInflationData(), 
        fetchEmploymentData(), 
        fetchHealthData(), 
        fetchGrowthData(), 
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
      const earthquakes = await fetchEarthQuakes();
      setEarthquakes(earthquakes);
      localStorage.setItem("earthquakes", JSON.stringify(earthquakes));      
      setMortalityData(mortalityData);
      localStorage.setItem("mortalityData", JSON.stringify(mortalityData));      
      setDebtData(debtData);
      localStorage.setItem("debtData", JSON.stringify(debtData));
      setInflationData(inflationData);
      localStorage.setItem("inflationData", JSON.stringify(inflationData));
      setEmploymentData(employmentData);
      localStorage.setItem("employmentData", JSON.stringify(employmentData));
      setHealthData(healthData);
      localStorage.setItem("healthData", JSON.stringify(healthData));
      setGrowthData(growthData);
      localStorage.setItem("growthData", JSON.stringify(growthData));

      console.log("All data fetched successfully.");
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Ladezustand um eine Sekunde verzögern
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

  const parseJSON = (data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Invalid JSON data:", e, data);
      return null;
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
    const storedDebtData = localStorage.getItem("debtData");
    const storedInflationData = localStorage.getItem("inflationData");
    const storedEmploymentData = localStorage.getItem("employmentData");
    const storedHealthData = localStorage.getItem("healthData");
    const storedGrowthData = localStorage.getItem("growthData");

    const parseJSON = (data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Invalid JSON data:", e);
        return null;
      }
    };

    if (storedGeoJsonData) {
      const parsedGeoJsonData = parseJSON(storedGeoJsonData);
      if (parsedGeoJsonData) setGeoJsonData(parsedGeoJsonData);
    } else {
      fetchData();
    }

    if (storedCountries && storedGdpData && storedLocationData) {
      const parsedCountries = parseJSON(storedCountries);
      const parsedGdpData = parseJSON(storedGdpData);
      if (parsedCountries) setCountries(parsedCountries);
      if (parsedGdpData) setGdpData(parsedGdpData);
    } else {
      fetchData();
    }

    if (storedEarthquakes) {
      const parsedEarthquakes = parseJSON(storedEarthquakes);
      if (parsedEarthquakes) setEarthquakes(parsedEarthquakes);
    } else {
      fetchAllData();
    }

    if (cachedData) {
      const parsedCachedData = parseJSON(cachedData);
      if (parsedCachedData) setEarthQuakeData(parsedCachedData);
    } else {
      fetchAndStoreEarthQuakeData();
    }

    if (storedMortalityData) {
      const parsedMortalityData = parseJSON(storedMortalityData);
      if (parsedMortalityData) setMortalityData(parsedMortalityData);
    } else {
      fetchAllData();
    }

    if (storedDebtData) {
      const parsedDebtData = parseJSON(storedDebtData);
      if (parsedDebtData) setDebtData(parsedDebtData);
    } else {
      fetchAllData();
    }

    if (storedInflationData) {
      const parsedInflationData = parseJSON(storedInflationData);
      if (parsedInflationData) setInflationData(parsedInflationData);
    } else {
      fetchAllData();
    }

    if (storedEmploymentData) {
      const parsedEmploymentData = parseJSON(storedEmploymentData);
      if (parsedEmploymentData) setEmploymentData(parsedEmploymentData);
    } else {
      fetchAllData();
    }

    if (storedHealthData) {
      const parsedHealthData = parseJSON(storedHealthData);
      if (parsedHealthData) setHealthData(parsedHealthData);
    } else {
      fetchAllData();
    }

    if (storedGrowthData) {
      const parsedGrowthData = parseJSON(storedGrowthData);
      if (parsedGrowthData) setGrowthData(parsedGrowthData);
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
       geoJsonData, gdpData, showBorders, setShowBorders, 
      colorScheme, setColorScheme, heatmapTopAltitude, setHeatmapTopAltitude, heatmapBandwidth, setHeatmapBandwidth, 
      maxPolygonAltitude, setMaxPolygonAltitude, 
      earthquakes, // Erdbebendaten im Kontext bereitstellen
      earthQuakeData, fetchAndStoreEarthQuakeData,
      mortalityData, // Sterblichkeitsdaten im Kontext bereitstellen
      debtData, // Schuldendaten im Kontext bereitstellen
      inflationData, // Inflationsdaten im Kontext bereitstellen
      employmentData, // Beschäftigungsdaten im Kontext bereitstellen
      healthData, // Gesundheitsdaten im Kontext bereitstellen
      growthData, // Wirtschaftswachstumsdaten im Kontext bereitstellen
      loading, // Ladezustand im Kontext bereitstellen
      showGrid, setShowGrid, // Grid-Zustand im Kontext bereitstellen
      cableColorSet, setCableColorSet, // Hinzufügen der Zustände für das Farbset
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
