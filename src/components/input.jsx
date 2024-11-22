import React, { useState, useEffect } from "react";
import axios from "axios";

function Input({ onWorldChange, onCountryChange }) {
  const [countries, setCountries] = useState([]);
  console.log("input:");
  const images = [
    ["Dunkle Erde", "earthDark.jpg"],
    ["Blaue Marmor Erde", "earthMarble.jpg"],
    ["Nacht Erde", "earthNight.jpg"],
    ["Wasser Erde", "earthWaterBW.png"],
    ["Topology", "earthTopology.png"],
    ["Ocean", "earthOcean.webp"],
    ["ultra Resolution", "earthUltra_2.jpg"],
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
    <div className="flex flex-col justify-center items-center w-1/5 absolute left-0 z-50 bottom-[10%] top-[10%] bg-glass rounded-r-3xl">
      <label htmlFor="world-select" className="mb-2">
        Wähle ein World-Bild:
      </label>

      <select
        id="world-select"
        onChange={(e) => onWorldChange(e.target.value)}
        className="p-2 rounded w-1/3 bg-transparent text-white"
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
        onChange={(e) => onCountryChange(e.target.value)}
        className="p-2 rounded w-1/3 bg-transparent text-white"
      >
        {countries.map((country) => (
          <option key={country.cca3} value={country.name.common}>
            {country.name.common}
          </option>
        ))}
      </select>

    </div>
  );
}

export default Input;
