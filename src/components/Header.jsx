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
    <header className="flex justify-around items-center bg-glass text-white fixed top-0 left-0 right-0 z-50  md:h-[10%] h-[10%] p-0">
      <h1 className="text-xl font-bold w-1/3 hidden md:block">DataGlobe</h1>
      <div className="md:w-1/4 flex justify-center">
        <img src="/logo_trans.png" alt="" className="h-14 animate-pulse" />
      </div>
      <div className="flex items-center justify-left relative md:w-1/3 w-[80%] text-xs md:ml-4">
        {/* Suchfeld */}
        <input
          type="text"
          placeholder="Land suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" p-1 rounded border bg-transparent text-white w-1/4 h-8 max-h-8 "
        />
        {/* Liste zur Länderauswahl */}
        <ul className={`bg-transparent border p-1 w-1/3 text-white text-xs rounded md:mt-0 min-h-8 max-h-8 ml-2 overflow-y-scroll absolute top-0 bg-neutral-900 z-[1000] left-1/4 ${searchTerm ? 'max-h-[50vh]' : 'md:hover:h-[1000%]'}`}>
          {filteredCountries.map((country) => (
            <li
              key={country.cca3}
              onClick={() => {
                setSelectedCountry(country);
                setSearchTerm(""); // Suchfeld leeren
              }}
              className="p-1 cursor-pointer hover:bg-cyan-800 text-xs"
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
