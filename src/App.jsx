import './App.css'
import GlobeComponent from './components/globe'
import Input from './components/input'
import Output from './components/output'
import { useState, useEffect } from 'react';

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
    <main className='flex justify-between w-screen h-screen '>
      <Input 
        onWorldChange={setSelectedWorld} 
        onCountryChange={setSelectedCountry} 
        onDataOptionChange={setDataOption} 
        onShowDataChange={setShowData} 
        onRotationSpeedChange={setRotationSpeed}
      />
      <GlobeComponent 
        selectedWorld={images[selectedWorld] || selectedWorld} 
        dataOption={dataOption} 
        showData={showData} 
        onCountrySelect={setSelectedCountry} 
        rotationSpeed={rotationSpeed}
      />
      <Output selectedCountry={selectedCountry} />     
    </main>
  )
}

export default App;
