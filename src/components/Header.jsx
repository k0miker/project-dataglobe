import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

function Header() {
  const { countries, setSelectedCountry } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

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
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm, filteredCountries, setSelectedCountry]);

  return (
    <header className="flex md:justify-between items-center justify-start bg-glass text-white fixed top-1 left-1 right-1 z-50 rounded-t-xl md:h-[10%] h-[7%] p-0">
      <h1 className="text-xl font-bold w-1/3 hidden md:block">DataGlobe</h1>
      <div className="md:w-1/4 flex justify-center">
        <img src="/logo_trans.png" alt="" className="h-14 animate-pulse" />
      </div>
      <div className="flex items-center flex-col md:flex-row md:w-1/3 text-xs ml-4">
        {/* Suchfeld */}
        <input
          type="text"
          placeholder="Land suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" p-1 rounded border bg-transparent text-white w-full"
        />
        {/* Liste zur Länderauswahl */}
        <ul className="bg-glass w-full text-black rounded mt-1 max-h-5 hover:max-h-1/2 overflow-y-auto">
          {filteredCountries.map((country) => (
            <li
              key={country.cca3}
              onClick={() => {
                setSelectedCountry(country);
                setSearchTerm(""); // Suchfeld leeren
              }}
              className="p-1 cursor-pointer hover:bg-cyan-700 truncate"
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
