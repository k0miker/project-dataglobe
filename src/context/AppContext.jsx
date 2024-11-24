import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCountries, fetchGeoJson } from "../utils/fetches";

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

  // Visualisierungstyp ändern und Weltkarte entsprechend anpassen
  const setVisualizationType = (type) => {
    if (type === "heatmap") {
      setSelectedWorld("earthNight.jpg");
    } else if (type === "cable" || type === "CableGlobe") {
      setSelectedWorld("earthDark.png");
    }
    setVisualizationTypeState(type);
  };

  const fetchData = async () => {
    try {
      const [countriesData, geoJsonData] = await Promise.all([
        fetchCountries(),
        fetchGeoJson()
      ]);

      const filteredGeoJsonData = geoJsonData.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      );

      localStorage.setItem("countries", JSON.stringify(countriesData));
      localStorage.setItem("geoJsonData", JSON.stringify(filteredGeoJsonData));

      setCountries(countriesData);
      setGeoJsonData(filteredGeoJsonData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  // Daten beim Laden der Komponente abrufen oder aus dem lokalen Speicher laden
  useEffect(() => {
    const storedCountries = localStorage.getItem("countries");
    const storedGeoJsonData = localStorage.getItem("geoJsonData");

    if (storedCountries && storedGeoJsonData) {
      setCountries(JSON.parse(storedCountries));
      setGeoJsonData(JSON.parse(storedGeoJsonData));
    } else {
      fetchData();
    }
  }, []);

  return (
    <AppContext.Provider value={{ selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, dataOption, setDataOption, showData, setShowData, rotationSpeed, setRotationSpeed, visualizationType, setVisualizationType, countries, clouds, setClouds, geoJsonData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
