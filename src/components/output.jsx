import React from "react";
import { useAppContext } from "../context/AppContext";

function Output() {
  const { selectedCountry } = useAppContext();

  if (!selectedCountry) {
    return (
      <div className="w-1/5 absolute right-0 top-[10%] bottom-[10%] flex flex-col justify-center items-center bg-glass rounded-l-3xl">
        <h1 className="text-2xl">Länderinfo</h1>
        <p>Bitte wählen Sie ein Land aus.</p>
      </div>
    );
  }

  return (
    <div className="w-1/5 absolute right-0 top-[10%] bottom-[10%] flex flex-col justify-center items-center bg-glass rounded-l-3xl p-4">
      <h1 className="text-2xl mb-4">{selectedCountry.name.common}</h1>
      <div className="flex justify-center">
        <img
          src={selectedCountry.flags.png}
          alt={`Flagge von ${selectedCountry.name.common}`}
          className="w-32 h-auto rounded-lg border-2 border-gray-200"
        />
      </div>
      <ul className="text-left mt-4 space-y-2">
        <li>
          <b>Hauptstadt:</b>{" "} <span> {selectedCountry.capital
            ? selectedCountry.capital.join(", ")
            : "Keine Daten"}</span>
         
        </li>
        <li>
          <b>Region:</b> <span>{selectedCountry.region}</span>
        </li>
        <li>
          <b>Unterregion:</b> <span>{selectedCountry.subregion || "Keine Daten"}</span>
        </li>
        <li>
          <b>Einwohner:</b> <span>{(selectedCountry.population / 1e6).toFixed(2)} Mio</span>
        </li>
        <li>
          <b>Fläche:</b>{" "}
          <span>{selectedCountry.area ? `${selectedCountry.area} km²` : "Keine Daten"}</span>
        </li>
        <li>
          <b>Bevölkerungsdichte:</b>{" "}
          <span>{selectedCountry.area
            ? `${(selectedCountry.population / selectedCountry.area).toFixed(
                2
              )} Pers./km²`
            : "Keine Daten"}</span>
        </li>
        <li>
          <b>Sprachen:</b>{" "}
          <span>{selectedCountry.languages
            ? Object.values(selectedCountry.languages).join(", ")
            : "Keine Daten"}</span>
          
        </li>
        <li>
          <b>Währungen:</b>{" "}
          <span>{selectedCountry.currencies
            ? Object.values(selectedCountry.currencies)
                .map((currency) => `${currency.name} (${currency.symbol})`)
                .join(", ")
            : "Keine Daten"}</span>
          
        </li>
        <li>
          <b>Unabhängig:</b> <span>{selectedCountry.independent ? "Ja" : "Nein"}</span> 
        </li>
      </ul>
    </div>
  );
}

export default Output;
