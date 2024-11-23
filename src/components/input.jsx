import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";

function Input() {
  const { selectedWorld, setSelectedWorld, setSelectedCountry, setDataOption, setRotationSpeed, showData, setShowData } = useAppContext();
  const [countries, setCountries] = useState([]);

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
    <div className="flex flex-col justify-center items-center w-1/5 absolute left-0 z-50 bottom-[10%] top-[10%] bg-glass rounded-r-3xl shadow-lg p-6">
      <label htmlFor="world-select" className="mb-2 font-bold text-lg">
        Wähle ein World-Bild:
      </label>
      <select
        id="world-select"
        value={selectedWorld}
        onChange={(e) => setSelectedWorld(e.target.value)}
        className="p-2 rounded w-full bg-transparent border border-gray-300"
      >
        {[
          ["Dark", "earthDark.png"],
          ["Blue Marble", "earthMarble.png"],
          ["Night", "earthNight.jpg"],
          ["Rivers", "earthWater.png"],
          ["Rivers B&W", "earthWaterBW.png"],
          ["Topology", "earthTopology.png"],
          ["Continets", "earthOcean.webp"],
          ["Tectonic", "earthTectonic.jpg"],
          ["Ultra Resolution", "earthUltra.jpg"],
        ].map(([name, img]) => (
          <option key={img} value={img}>
            {name}
          </option>
        ))}
      </select>

      <label htmlFor="country-select" className="mt-4 mb-2 font-bold text-lg">
        Wählen Sie ein Land:
      </label>
      <select
        id="country-select"
        onChange={(e) =>
          setSelectedCountry(
            countries.find((country) => country.cca3 === e.target.value)
          )
        }
        className="p-2 rounded w-full bg-transparent border border-gray-300"
      >
        {countries.map((country) => (
          <option key={country.cca3} value={country.cca3}>
            {country.name.common}
          </option>
        ))}
      </select>

      <label htmlFor="data-option-select" className="mt-4 mb-2 font-bold text-lg">
        Wählen Sie eine Datenoption:
      </label>
      <select
        id="data-option-select"
        onChange={(e) => setDataOption(e.target.value)}
        className="p-2 rounded w-full bg-transparent  border border-gray-300"
      >
        <option value="gdp">BIP pro Kopf</option>
        <option value="density">Bevölkerungsdichte</option>
      </select>

      <label htmlFor="show-data-checkbox" className="mt-4 mb-2 font-bold text-lg">
        Daten anzeigen:
      </label>
      <input
        type="checkbox"
        id="show-data-checkbox"
        checked={showData}
        onChange={(e) => setShowData(e.target.checked)}
        className="p-2 rounded bg-gray-700 text-white accent-color"
      />

      <label htmlFor="rotation-speed-slider" className="mt-4 mb-2 font-bold text-lg">
        Rotationsgeschwindigkeit:
      </label>
      <input
        type="range"
        id="rotation-speed-slider"
        min="0"
        max="2"
        step="0.1"
        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
        className="p-2 rounded w-full bg-gray-700 text-white accent-color"
      />
    </div>
  );
}

export default Input;
