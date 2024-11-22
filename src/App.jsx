import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
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
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}

export default App;
