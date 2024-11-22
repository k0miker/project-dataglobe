import React, { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import GlobeComponent from './components/globe';
import Input from './components/input';
import Output from './components/output';
import './App.css';

import HomePage from "./pages/HomePage";

function App() {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.jpg");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataOption, setDataOption] = useState("gdp");
  const [showData, setShowData] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.2);
  const [images, setImages] = useState({});

  useEffect(() => {
    const imageUrls = [
      "earthDark.jpg",
      "earthMarble.jpg",
      "earthNight_2.jpg",
      "earthWaterBW.png",
      "earthTopology.png",
      "earthOcean.webp",
      "earthTectonic.jpg",
      "earthUltra_3.jpg",
    ];

    const loadImages = async () => {
      const loadedImages = {};
      for (const url of imageUrls) {
        const img = new Image();
        img.src = url;
        await img.decode();
        loadedImages[url] = img.src;
      }
      setImages(loadedImages);
    };

    loadImages();
  }, []);

  return (
    <AppProvider value={{ selectedWorld, setSelectedWorld, selectedCountry, setSelectedCountry, dataOption, setDataOption, showData, setShowData, rotationSpeed, setRotationSpeed }}>
      <main className='flex justify-between w-screen h-screen '>
        <Input />
        <GlobeComponent />
        <Output />
      </main>
    </AppProvider>
  );
}

export default App;
