import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

function Output() {
  const { selectedCountry } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false); // State für Modal
  const [isExpanded, setIsExpanded] = useState(false); // State für Animation

  useEffect(() => {
    if (selectedCountry) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [selectedCountry]);

  // UI-Inhalt für Länderinformationen
  const CountryDetails = () => {
    const { mortalityData, geoJsonData, debtData, inflationData, employmentData, healthData, growthData } = useAppContext(); // Sterblichkeitsdaten, GeoJSON-Daten, Schuldendaten, Inflationsdaten, Beschäftigungsdaten, Gesundheitsdaten und Wirtschaftswachstumsdaten aus dem Kontext
    const [isExpanded, setIsExpanded] = useState(false); // State für das Ausklappen

    if (!selectedCountry) {
      return (
        <div className="flex flex-col justify-center items-center p-4">
          <h1 className=" minishadow font-bold mb-4">Country Info</h1>
          <p className="text-sm">Select a country.</p>
        </div>
      );
    }

    const mortalityInfo = mortalityData.find(
      (country) => country.cca2 === selectedCountry.cca2
    );

    const geoJsonCountry = geoJsonData.find(
      (country) => country.properties.ISO_A2 === selectedCountry.cca2
    );

    const debtInfo = debtData.find(
      (country) => country.cca2 === selectedCountry.cca2
    );

    const inflationInfo = inflationData.find(
      (country) => country.cca2 === selectedCountry.cca2
    );

    const employmentInfo = employmentData.find(
      (country) => country.cca2 === selectedCountry.cca2
    );

    const healthInfo = healthData.find(
      (country) => country.cca2 === selectedCountry.cca2
    );

    const growthInfo = growthData.find(
      (country) => country.cca2 === selectedCountry.cca2
    );

    return (
      <div className="flex max-w-[250px]  flex-col justify-center items-center rounded-bl-3xl p-4">
        <div className="flex flex-col justify-center ">
          <img
            src={selectedCountry.flags.png}
            alt={`Flagge von ${selectedCountry.name.common}`}
            className="w-28 rounded-lg border-2 border-gray-200 shadow-md opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
          <h1 className="text-2xl text-center font-bold ">
            {selectedCountry.name.common}
          </h1>
        </div>
        <ul className="text-left mt-4 space-y-2 w-full text-sm">
          <li className="flex justify-between">
            <b className="decoration-red-800 underline">Capital:</b>{" "}
            <span className="text-xs p-1">
              {selectedCountry.capital
                ? selectedCountry.capital.join(", ")
                : "No data"}
            </span>
          </li>
          <li className="flex justify-between">
            <b className="decoration-red-800 underline">Region:</b> <span className="text-xs p-1">{selectedCountry.region}</span>
          </li>
          <li className="flex justify-between">
            <b className="decoration-red-800 underline">Population:</b>{" "}
            <span className="text-xs p-1">{(selectedCountry.population / 1e6).toFixed(2)} million</span>
          </li>
          <li className="flex justify-between">
            <b className="decoration-red-800 underline">Area:</b>{" "}
            <span className="text-xs p-1">
              {selectedCountry.area
                ? `${selectedCountry.area} km²`
                : "No data"}
            </span>
          </li>
          <li className="flex justify-between">
            <b className="decoration-red-800 underline">Languages:</b>{" "}
            <span className="text-xs p-1">
              {selectedCountry.languages
                ? selectedCountry.languages[0]
                : "No data"}
            </span>
          </li>
          <li className="flex justify-between">
            <b className="decoration-red-800 underline">Currency:</b>{" "}
            <span className="text-xs p-1">
              {selectedCountry.currencies
                ? Object.values(selectedCountry.currencies)
                    .map((currency) => `${currency.name} (${currency.symbol})`)
                    .join(", ")
                : "No data"}
            </span>
          </li>
        </ul>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
        {isExpanded && (
          <ul className="text-left mt-4 space-y-2 w-full text-sm">
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Mortality Rate:</b>{" "}
              <span className="text-xs p-1">{mortalityInfo ? `${mortalityInfo.value.toFixed(2)}%` : "No data"}</span>
            </li>
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Economy:</b>{" "}
              <span className="text-xs p-1">{geoJsonCountry ? geoJsonCountry.properties.ECONOMY : "No data"}</span>
            </li>
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Debt <i className="text-[10px]">(% of GDP):</i></b>{" "}
              <span className="text-xs p-1">{debtInfo ? `${debtInfo.value.toFixed(2)}%` : "No data"}</span>
            </li>
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Inflation:</b>{" "}
              <span className="text-xs p-1">{inflationInfo ? `${inflationInfo.value.toFixed(2)}%` : "No data"}</span>
            </li>
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Unemployment Rate:</b>{" "}
              <span className="text-xs p-1">{employmentInfo ? `${employmentInfo.value.toFixed(2)}%` : "No data"}</span>
            </li>
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Health Expenditure <br /> <i className="text-[10px]">(% of GDP):</i></b>{" "}
              <span className="text-xs p-1">{healthInfo ? `${healthInfo.value.toFixed(2)}%` : "No data"}</span>
            </li>
            <li className="flex justify-between">
              <b className="decoration-red-800 underline">Economic Growth:</b>{" "}
              <span className="text-xs p-1">{growthInfo ? `${growthInfo.value.toFixed(2)}%` : "No data"}</span>
            </li>
          </ul>
        )}
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
        🌍 Country Info
      </button>

      {/* Modal für mobile Ansicht */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)} // Schließen des Modals durch Klicken außerhalb
        >
          <div
            className="bg-glass rounded-lg shadow-lg w-11/12 max-w-md p-4"
            onClick={(e) => e.stopPropagation()} // Verhindern des Schließens beim Klicken innerhalb des Modals
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Country Info</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-100 hover:text-red-700"
              >
                ✖
              </button>
            </div>
            {/* Modal Inhalt */}
            <CountryDetails />
          </div>
        </div>
      )}

      {/* Sidebar für Desktop- und Tablet-Ansicht */}
      <div
        className={`hidden md:flex flex-col justify-start items-center md:absolute md:right-0 md:top-[10%] bg-glass rounded-bl-3xl shadow-lg p-2 transition-transform duration-500 
        }`}
      >
        <CountryDetails />
      </div>
    </>
  );
}

export default Output;
