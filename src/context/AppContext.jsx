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
  const [worldBankData, setWorldBankData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [gdpData, setGdpData] = useState([]);
  const [resize, setResize] = useState(false);


  // Visualisierungstyp ändern und Weltkarte entsprechend anpassen
  const setVisualizationType = (type) => {
    if (type === "heatmap") {
      setSelectedWorld("earthNight.jpg");
    } else if (type === "cable" || type === "CableGlobe") {
      setSelectedWorld("earthDark.png");
    }
    setVisualizationTypeState(type);
  };

  const combineData = (countries, worldBankData, locationData ) => {
    console.log("gdp:"+ JSON.stringify({}));
    // console.log("location:"+ {locationData});
    // console.log("countries:"+ {countries});
    
    fetchGDPDataForCountries(countries);

    setWorldBankData(fetchGDPDataForCountries(countries))
    console.log("worldBankData:"+ {gdpData});
    

    
    const locationCsv = d3.csvParse(locationData);
    const combined = locationCsv.map(location => {
      const country = countries.find(c => c.cca2 === location.cca2);
      const gdpData = worldBankData.find(data => data.country.id === location.cca2);
      return {
        ...location,
        name: country ? country.name.common : location.name,
        gdp: gdpData ? gdpData.value : null
      };
    });
    setCombinedData(combined);
    localStorage.setItem("combinedData", JSON.stringify(combined));
  };

  const fetchData = async () => {
    try {
      const [countriesData, geoJsonData, locationData] = await Promise.all([
        fetchCountries(),
        fetchGeoJson(),
        fetchLocationData()
      ]);

      const worldBankData = await fetchGDPDataForCountries(countriesData);
      setGdpData(worldBankData);

      const filteredGeoJsonData = geoJsonData.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      );

      localStorage.setItem("countries", JSON.stringify(countriesData));
      localStorage.setItem("geoJsonData", JSON.stringify(filteredGeoJsonData));
      localStorage.setItem("worldBankData", JSON.stringify(worldBankData));
      localStorage.setItem("locationData", locationData);

      setCountries(countriesData);
      setGeoJsonData(filteredGeoJsonData);
      setWorldBankData(worldBankData);
      combineData(countriesData, worldBankData, locationData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  // Daten beim Laden der Komponente abrufen oder aus dem lokalen Speicher laden
  useEffect(() => {
    const storedCountries = localStorage.getItem("countries");
    const storedGeoJsonData = localStorage.getItem("geoJsonData");
    const storedWorldBankData = localStorage.getItem("worldBankData");
    const storedLocationData = localStorage.getItem("locationData");

    if (storedCountries && storedGeoJsonData && storedWorldBankData && storedLocationData) {
      setCountries(JSON.parse(storedCountries));
      setGeoJsonData(JSON.parse(storedGeoJsonData));
      setWorldBankData(JSON.parse(storedWorldBankData));
      combineData(JSON.parse(storedCountries), JSON.parse(storedWorldBankData), storedLocationData);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    // console.log(combinedData);
  }, [combinedData]);

  return (
    <AppContext.Provider value={{ selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, dataOption, setDataOption, showData, setShowData, rotationSpeed, setRotationSpeed, visualizationType, setVisualizationType, countries, clouds, setClouds, geoJsonData, worldBankData, combinedData, gdpData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
