import React, { useState, useEffect } from "react";
import axios from "axios";

const dataOptions = [
  { label: "BIP pro Kopf", value: "gdp" },
  { label: "Bevölkerungsdichte", value: "density" },
];

function Input({ onWorldChange, onCountryChange, onDataOptionChange, onShowDataChange, onRotationSpeedChange }) {
  const [countries, setCountries] = useState([]);
  const images = [
    ["Dark", "earthDark.jpg"],
    ["Blue Marbel", "earthMarble.jpg"],
    ["Night", "earthNight_2.jpg"],
    ["Rivers W&B", "earthWaterBW.png"],
    ["Rivers B&W", "earthWater_upscayle.png"],
    ["Topology", "earthTopology.png"],
    ["Ocean", "earthOcean.webp"],
    ["Tectonic", "earthTectonic.jpg"],
    ["ultra Resolution", "earthUltra_3.jpg"],
  ];

  const fetchCountries = useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Fehler beim Abrufen der Länder:", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-1/5 absolute left-0 z-50 bottom-[10%] top-[10%] bg-glass rounded-r-3xl p-4">
      <label htmlFor="world-select" className="mb-2">
        Wähle ein World-Bild:
      </label>

      <select
        id="world-select"
        onChange={(e) => onWorldChange(e.target.value)}
        className="p-2 rounded w-full bg-transparent text-white accent-color"
      >
        {images.map(([name, img], index) => (
          <option key={index} value={img}>
            {name}
          </option>
        ))}
      </select>

      <label htmlFor="country-select" className="mt-4 mb-2">
        Wählen sie ein Land:
      </label>

      <select
        id="country-select"
        onChange={(e) => {
          const selectedCountry = countries.find(country => country.cca3 === e.target.value);
          onCountryChange(selectedCountry);
        }}
        className="p-2 rounded w-full bg-transparent text-white accent-color"
      >
        {countries.map((country) => (
          <option key={country.cca3} value={country.cca3}>
            {country.name.common}
          </option>
        ))}
      </select>

      <label htmlFor="data-option-select" className="mt-4 mb-2">
        Wählen Sie eine Datenoption:
      </label>
      <select
        id="data-option-select"
        onChange={(e) => onDataOptionChange(e.target.value)}
        className="p-2 rounded w-full bg-transparent text-white accent-color"
      >
        {dataOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor="show-data-checkbox" className="mt-4 mb-2">
        Daten anzeigen:
      </label>
      <input
        type="checkbox"
        id="show-data-checkbox"
        onChange={(e) => onShowDataChange(e.target.checked)}
        className="p-2 rounded bg-transparent text-white accent-color"
        defaultChecked
      />

      <label htmlFor="rotation-speed-slider" className="mt-4 mb-2">
        Rotationsgeschwindigkeit:
      </label>
      <input
        type="range"
        id="rotation-speed-slider"
        min="0"
        max="5"
        step="0.1"
        onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
        className="p-2 rounded w-full bg-transparent text-white accent-color"
      />

    </div>
  );
}

export default Input;
