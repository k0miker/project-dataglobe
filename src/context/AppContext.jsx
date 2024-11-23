import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.png");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataOption, setDataOption] = useState("gdp");
  const [showData, setShowData] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.2);
  const [images, setImages] = useState({});

  useEffect(() => {
    const imageUrls = [
      "earthDark.png",
      "earthMarble.png",
      "earthNight.jpg",
      "earthWaterBW.png",
      "earthWater.png",
      "earthTopology.png",
      "earthOcean.webp",
      "earthTectonic.jpg",
      "earthUltra.jpg",
    ];

    const loadImages = async () => {
      const loadedImages = {};
      for (const url of imageUrls) {
        try {
          const img = new Image();
          img.src = url;
          await img.decode();
          loadedImages[url] = img.src;
        } catch (error) {
          console.error(`Fehler beim Laden des Bildes ${url}:`, error);
        }
      }
      setImages(loadedImages);
    };

    loadImages();
  }, []);

  return (
    <AppContext.Provider value={{ selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, dataOption, setDataOption, showData, setShowData, rotationSpeed, setRotationSpeed, images }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
