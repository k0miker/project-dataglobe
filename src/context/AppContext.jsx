import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCountries } from "../utils/fetches";

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

  // Visualisierungstyp ändern und Weltkarte entsprechend anpassen
  const setVisualizationType = (type) => {
    if (type === "heatmap") {
      setSelectedWorld("earthNight.jpg");
    } else if (type === "cable" || type === "CableGlobe") {
      setSelectedWorld("earthDark.png");
    }
    setVisualizationTypeState(type);
  };

  // Länder beim Laden der Komponente abrufen
  useEffect(() => {
    const getCountries = async () => {
      try {
        const sortedCountries = await fetchCountries();
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Fehler beim Abrufen der Länder:", error);
      }
    };
    getCountries();
  }, []);

  return (
    <AppContext.Provider value={{ selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, dataOption, setDataOption, showData, setShowData, rotationSpeed, setRotationSpeed, visualizationType, setVisualizationType, countries, clouds, setClouds }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
