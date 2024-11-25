import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCountries, fetchGeoJson, fetchLocationData, fetchGDPDataForCountries } from "../utils/fetches";
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
  const [combinedData, setCombinedData] = useState([]);
  const [gdpData, setGdpData] = useState([]);
  const [resize, setResize] = useState(false);
  const [showBorders, setShowBorders] = useState(true); // State für Länderumrisse

  // Visualisierungstyp ändern und Weltkarte entsprechend anpassen
  const setVisualizationType = (type) => {
    if (type === "heatmap") {
      setSelectedWorld("earthNight.jpg");
    } else if (type === "cable" || type === "CableGlobe") {
      setSelectedWorld("earthDark.png");
    }
    setVisualizationTypeState(type);
  };

  const combineData = (countries, gdpData, locationData ) => {
    console.log("gdp:"+ JSON.stringify(gdpData));
    
    const locationCsv = d3.csvParse(locationData);
    const combined = locationCsv.map(location => {
      const country = countries.find(c => c.cca2 === location.cca2);
      const gdpEntry = gdpData.find(data => data.country === location.cca2);
      return {
        ...location,
        name: country ? country.name.common : location.name,
        gdp: gdpEntry ? gdpEntry.gdp : null
      };
    });
    setCombinedData(combined);
    localStorage.setItem("combinedData", JSON.stringify(combined));
  };

  const fetchData = async () => {
    try {
      const [geoJsonData] = await Promise.all([
        fetchGeoJson()
      ]);

      const filteredGeoJsonData = geoJsonData.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      );

      localStorage.setItem("geoJsonData", JSON.stringify(filteredGeoJsonData));
      setGeoJsonData(filteredGeoJsonData);

      // Fetch the rest of the data in the background
      const [countriesData, locationData] = await Promise.all([
        fetchCountries(),
        fetchLocationData()
      ]);

      const gdpData = await fetchGDPDataForCountries(countriesData);
      setGdpData(gdpData);

      localStorage.setItem("countries", JSON.stringify(countriesData));
      localStorage.setItem("gdpData", JSON.stringify(gdpData));
      localStorage.setItem("locationData", locationData);

      setCountries(countriesData);
      combineData(countriesData, gdpData, locationData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  // Daten beim Laden der Komponente abrufen oder aus dem lokalen Speicher laden
  useEffect(() => {
    const storedGeoJsonData = localStorage.getItem("geoJsonData");

    if (storedGeoJsonData) {
      setGeoJsonData(JSON.parse(storedGeoJsonData));
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const storedCountries = localStorage.getItem("countries");
    const storedGdpData = localStorage.getItem("gdpData");
    const storedLocationData = localStorage.getItem("locationData");

    if (storedCountries && storedGdpData && storedLocationData) {
      setCountries(JSON.parse(storedCountries));
      setGdpData(JSON.parse(storedGdpData));
      combineData(JSON.parse(storedCountries), JSON.parse(storedGdpData), storedLocationData);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    // console.log(combinedData);
  }, [combinedData]);

  return (
    <AppContext.Provider value={{ 
      selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, 
      dataOption, setDataOption, showData, setShowData, rotationSpeed, 
      setRotationSpeed, visualizationType, setVisualizationType, countries, 
      clouds, setClouds, geoJsonData, gdpData, combinedData, showBorders, setShowBorders 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
