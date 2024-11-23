import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

function Header() {
  const { countries, setSelectedCountry } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="flex justify-between items-center p-4 bg-glass text-white fixed top-1 left-1 right-1 z-50 rounded-t-xl h-[10%] ">
      <h1 className="text-xl font-bold w-1/4">DataGlobe</h1>
      <div className="w-1/4 flex justify-center">
        <img src="/logo_trans.png" alt="" className="h-10 animate-pulse" />
      </div>
      <div className="flex items-center w-1/4">
        <input
          type="text"
          placeholder="Land suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded border bg-transparent text-white mr-2"
        />
        <select
          onChange={(e) =>
            setSelectedCountry(
              countries.find((country) => country.cca3 === e.target.value)
            )
          }
          className="p-2 rounded bg-transparent text-white w-60"
        >
          {filteredCountries.map((country) => (
            <option
              key={country.cca3}
              value={country.cca3}
              className="bg-transparent"
            >
              {country.name.common}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Header;
