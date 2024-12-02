import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

function Header() {
  const { countries, selectedCountry, setSelectedCountry } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Länder basierend auf dem Suchbegriff filtern
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Automatisch das Land auswählen, wenn nach 1 Sekunde nur ein Treffer gefunden wird
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredCountries.length === 1) {
        setSelectedCountry(filteredCountries[0]);
        setSearchTerm(""); // Suchfeld leeren
        setIsDropdownOpen(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm, filteredCountries, setSelectedCountry]);

  // Auswahl mit Pfeiltasten und Enter-Taste
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setSelectedCountry(filteredCountries[highlightedIndex]);
      setSearchTerm(""); // Suchfeld leeren
      setHighlightedIndex(-1);
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="flex justify-around items-center bg-glass text-white fixed top-0 left-0 right-0 z-50  md:h-[10%] h-[10%] p-4">
      <div className="w-1/3 hidden md:block"></div>
      <div className="md:w-1/4 flex justify-center relative">
      <i className="fixed top-7">DataGlobe</i>
        <img src="/logo.gif" alt="" className="h-14 " />
      </div>
      <h1 className="text-xs self-end pb-3 font-bold w-1/3 block md:hidden italic ">
        DataGlobe
      </h1>
      <div className="flex  items-center justify-end relative md:w-1/3 w-[60%] text-xs md:ml-4">
        {/* Suchfeld */}
        <div className="relative">      
          <input
            type="text"
            title="Land suchen"
            placeholder="Land suchen..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(-1);
              setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)}
            className="p-1 rounded border bg-transparent text-white w-full h-8 max-h-8"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
        </div>
        {/* Liste zur Länderauswahl */}
        <ul
          className={`absolute top-full mt-2 bg-neutral-900 border p-1 w-[57%] md:[] text-white text-xs rounded max-h-[50vh] overflow-y-auto z-[1000] ${
            isDropdownOpen ? "block" : "hidden"
          }`}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {selectedCountry && !searchTerm && (
            <li className="p-1 cursor-pointer bg-cyan-800 text-xs">
              {selectedCountry.name.common}
            </li>
          )}
          {filteredCountries.map((country, index) => (
            <li
              key={country.cca3}
              onClick={() => {
                setSelectedCountry(country);
                setSearchTerm(""); // Suchfeld leeren
                setIsDropdownOpen(false);
              }}
              className={`p-1 cursor-pointer bg-transparent hover:bg-cyan-800 text-xs ${
                country.cca3 === selectedCountry?.cca3 ? "bg-cyan-800" : ""
              }`}
            >
              {country.name.common}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default Header;
