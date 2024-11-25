import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

function Output() {
  const { selectedCountry } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false); // State für Modal

  // UI-Inhalt für Länderinformationen
  const CountryDetails = () => {
    if (!selectedCountry) {
      return (
        <div className="flex flex-col justify-center items-center bg-glass rounded-bl-3xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Länderinfo</h1>
          <p className="text-lg">Wähle ein Land.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center bg-glass rounded-bl-3xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          {selectedCountry.name.common}
        </h1>
        <div className="flex justify-center mb-4">
          <img
            src={selectedCountry.flags.png}
            alt={`Flagge von ${selectedCountry.name.common}`}
            className="w-32 h-auto rounded-lg border-2 border-gray-200 shadow-md"
          />
        </div>
        <ul className="text-left mt-4 space-y-2 w-full">
          <li className="flex justify-between">
            <b>Hauptstadt:</b>{" "}
            <span>
              {selectedCountry.capital
                ? selectedCountry.capital.join(", ")
                : "Keine Daten"}
            </span>
          </li>
          <li className="flex justify-between">
            <b>Region:</b> <span>{selectedCountry.region}</span>
          </li>
          <li className="flex justify-between">
            <b>Unterregion:</b>{" "}
            <span>{selectedCountry.subregion || "Keine Daten"}</span>
          </li>
          <li className="flex justify-between">
            <b>Einwohner:</b>{" "}
            <span>{(selectedCountry.population / 1e6).toFixed(2)} Mio</span>
          </li>
          <li className="flex justify-between">
            <b>Fläche:</b>{" "}
            <span>
              {selectedCountry.area
                ? `${selectedCountry.area} km²`
                : "Keine Daten"}
            </span>
          </li>
          <li className="flex justify-between">
            <b>Bevölkerungsdichte:</b>{" "}
            <span>
              {selectedCountry.area
                ? `${(
                    selectedCountry.population / selectedCountry.area
                  ).toFixed(2)} Pers./km²`
                : "Keine Daten"}
            </span>
          </li>
          <li className="flex justify-between">
            <b>Sprachen:</b>{" "}
            <span>
              {selectedCountry.languages
                ? Object.values(selectedCountry.languages).join(", ")
                : "Keine Daten"}
            </span>
          </li>
          <li className="flex justify-between">
            <b>Währungen:</b>{" "}
            <span>
              {selectedCountry.currencies
                ? Object.values(selectedCountry.currencies)
                    .map((currency) => `${currency.name} (${currency.symbol})`)
                    .join(", ")
                : "Keine Daten"}
            </span>
          </li>
          <li className="flex justify-between">
            <b>Unabhängig:</b>{" "}
            <span>{selectedCountry.independent ? "Ja" : "Nein"}</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* Button für mobile Ansicht */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-5 right-5 bg-glass text-white p-4 rounded-full shadow-lg z-50"
      >
        🌍 Länderinfo
      </button>

      {/* Modal für mobile Ansicht */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-glass rounded-lg shadow-lg w-11/12 max-w-md p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Länderinfo</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖️
              </button>
            </div>
            {/* Modal Inhalt */}
            <CountryDetails />
          </div>
        </div>
      )}

      {/* Sidebar für Desktop- und Tablet-Ansicht */}
      <div className="hidden md:flex flex-col justify-center items-center md:absolute md:right-0 md:top-[10.5%] md:bottom-[10%] bg-glass rounded-bl-3xl shadow-lg p-6">
        <CountryDetails />
      </div>
    </>
  );
}

export default Output;
