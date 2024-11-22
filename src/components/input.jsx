import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

function Input() {
  const { selectedWorld, setSelectedWorld, setSelectedCountry, setDataOption } =
    useAppContext();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
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
        value={selectedWorld}
        onChange={(e) => setSelectedWorld(e.target.value)}
        className="p-2 rounded w-full bg-gray-700 text-white"
      >
        {[
          ["Dark", "earthDark.jpg"],
          ["Blue Marble", "earthMarble.jpg"],
          ["Night", "earthNight_2.jpg"],
          ["Rivers", "earthWaterBW.png"],
          ["Topology", "earthTopology.png"],
          ["Ocean", "earthOcean.webp"],
          ["Tectonic", "earthTectonic.jpg"],
          ["Ultra Resolution", "earthUltra_2.jpg"],
        ].map(([name, img]) => (
          <option key={img} value={img}>
            {name}
          </option>
        ))}
      </select>

      <label htmlFor="country-select" className="mt-4 mb-2">
        Wählen Sie ein Land:
      </label>
      <select
        id="country-select"
        onChange={(e) =>
          setSelectedCountry(
            countries.find((country) => country.cca3 === e.target.value)
          )
        }
        className="p-2 rounded w-full bg-gray-700 text-white"
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
        onChange={(e) => setDataOption(e.target.value)}
        className="p-2 rounded w-full bg-gray-700 text-white"
      >
        <option value="gdp">BIP pro Kopf</option>
        <option value="density">Bevölkerungsdichte</option>
      </select>
    </div>
  );
}

export default Input;
