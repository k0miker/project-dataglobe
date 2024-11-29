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
        <div className="flex flex-col justify-center items-center  rounded-bl-3xl p-6">
          <h1 className="text-2xl font-bold mb-4">Länderinfo</h1>
          <p className="text-lg">Wähle ein Land.</p>
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
      <div className="flex flex-col justify-center items-center  rounded-bl-3xl  p-6">
        <h1 className="text-2xl font-bold mb-4">
          {selectedCountry.name.common}
        </h1>
        <div className="flex justify-center mb-4">
          <img
            src={selectedCountry.flags.png}
            alt={`Flagge von ${selectedCountry.name.common}`}
            className="w-32 h-auto rounded-lg border-2 border-gray-200 shadow-md opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <ul className="text-left mt-4 space-y-2 w-full text-sm">
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
            <b>Sprachen:</b>{" "}
            <span>
              {selectedCountry.languages
                ? selectedCountry.languages[0]
                : "Keine Daten"}
            </span>
          </li>
          <li className="flex justify-between">
            <b>Währung:</b>{" "}
            <span>
              {selectedCountry.currencies
                ? Object.values(selectedCountry.currencies)
                    .map((currency) => `${currency.name} (${currency.symbol})`)
                    .join(", ")
                : "Keine Daten"}
            </span>
          </li>
        </ul>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
        </button>
        {isExpanded && (
          <ul className="text-left mt-4 space-y-2 w-full text-sm">
            <li className="flex justify-between">
              <b>Sterblichkeitsrate:</b>{" "}
              <span>{mortalityInfo ? `${mortalityInfo.value}%` : "Keine Daten"}</span>
            </li>
            <li className="flex justify-between">
              <b>Wirtschaft:</b>{" "}
              <span>{geoJsonCountry ? geoJsonCountry.properties.ECONOMY : "Keine Daten"}</span>
            </li>
            <li className="flex justify-between">
              <b>Schulden (% des BIP):</b>{" "}
              <span>{debtInfo ? `${debtInfo.value.toFixed(2)}%` : "Keine Daten"}</span>
            </li>
            <li className="flex justify-between">
              <b>Inflation:</b>{" "}
              <span>{inflationInfo ? `${inflationInfo.value.toFixed(2)}%` : "Keine Daten"}</span>
            </li>
            <li className="flex justify-between">
              <b>Beschäftigungsrate:</b>{" "}
              <span>{employmentInfo ? `${employmentInfo.value.toFixed(2)}%` : "Keine Daten"}</span>
            </li>
            <li className="flex justify-between">
              <b>Gesundheitsausgaben (% des BIP):</b>{" "}
              <span>{healthInfo ? `${healthInfo.value.toFixed(2)}%` : "Keine Daten"}</span>
            </li>
            <li className="flex justify-between">
              <b>Wirtschaftswachstum:</b>{" "}
              <span>{growthInfo ? `${growthInfo.value.toFixed(2)}%` : "Keine Daten"}</span>
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
        🌍 Länderinfo
      </button>

      {/* Modal für mobile Ansicht */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)} // Schließen des Modals durch Klicken außerhalb
        >
          <div
            className="bg-glass rounded-lg shadow-lg w-11/12 max-w-md p-6"
            onClick={(e) => e.stopPropagation()} // Verhindern des Schließens beim Klicken innerhalb des Modals
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Länderinfo</h2>
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
        className={` md:flex flex-col justify-start items-center md:absolute md:right-0 md:top-[10%] bg-glass rounded-bl-3xl shadow-lg p-2 transition-transform duration-500 
        }`}
      >
        <CountryDetails />
      </div>
    </>
  );
}

export default Output;
