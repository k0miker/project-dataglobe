import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Input({ onWorldChange, onCountryChange }) {
  const [countries, setCountries] = useState([]);
console.log("input:");

  const fetchCountries = useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Fehler beim Abrufen der Länder:", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-1/5 absolute left-0 z-50 bottom-[10%] top-[10%] bg-glass rounded-r-3xl">
      <label htmlFor="world-select" className="mb-2">Wähle ein World-Bild:</label>
      <select id="world-select" onChange={(e) => onWorldChange(e.target.value)} className="p-2 rounded w-2/3 bg-transparent text-white">
        <option value="earthDark.jpg">Dunkle Erde</option>
        <option value="earthMarble.jpg">Blaue Marmor Erde</option>
        <option value="earthNight.jpg">Nacht Erde</option>
        <option value="earthWaterBW.png">Wasser Erde</option>
        <option value="earthTopology.png">Topology</option>
      </select>
      <label htmlFor="country-select" className="mt-4 mb-2">Wähle ein Land:</label>
      <select id="country-select" onChange={(e) => onCountryChange(e.target.value)} className="p-2 rounded w-2/3 bg-transparent text-white">
        {countries.map((country) => (
          <option key={country.cca3} value={country.name.common}>{country.name.common}</option>
        ))}
      </select>
    </div>
  );
}

export default Input;
