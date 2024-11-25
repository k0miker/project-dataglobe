import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";

function Input() {
  const {
    selectedWorld,
    setSelectedWorld,
    setDataOption,
    setRotationSpeed,
    showData,
    setShowData,
    visualizationType,
    setVisualizationType,
    dataOption,
  } = useAppContext();

  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State für Modal

  useEffect(() => {
    const getCountries = async () => {
      try {
        const sortedCountries = await fetchCountries();
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Fehler beim Abrufen der Länder:", error);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    if (visualizationType === "heatmap") {
      setDataOption("population");
    } else if (visualizationType === "polygon") {
      setDataOption("gdp");
    }
  }, [visualizationType]);

  // Einstellungen-UI-Komponente (wird in Sidebar und Modal verwendet)
  const SettingsContent = () => (
    <div className="flex flex-col">
      {/* Auswahl der Karte */}
      <label htmlFor="world-select" className="mb-2 font-bold text-sm">
        Karte:
      </label>
      <select
        id="world-select"
        value={selectedWorld}
        onChange={(e) => setSelectedWorld(e.target.value)}
        className="p-2 rounded w-full bg-transparent text-xs border border-gray-300 mb-4"
      >
        {[
          ["Dark", "earthDark.jpg"],
          ["Blue Marble", "earthMarble.png"],
          ["Night", "earthNight.jpg"],
          ["Rivers", "earthWater.png"],
          ["Rivers B&W", "earthWaterBW.png"],
          ["Topology", "earthTopology.png"],
          ["Continets", "earthOcean.webp"],
          ["Tectonic", "earthTectonic.jpg"],
          ["Ultra Resolution", "earthUltra.jpg"],
        ].map(([name, img]) => (
          <option key={img} value={img}>
            {name}
          </option>
        ))}
      </select>

      {/* Datenoption */}
      <label htmlFor="data-option-select" className="mb-2 font-bold text-sm">
        Datenoption:
      </label>
      <select
        id="data-option-select"
        value={dataOption}
        onChange={(e) => setDataOption(e.target.value)}
        className="p-2 rounded w-full bg-transparent text-xs border border-gray-300 mb-4"
      >
        {visualizationType === "polygon" && (
          <option value="gdp">BIP pro Kopf</option>
        )}
        {visualizationType === "polygon" && (
          <option value="density">Bevölkerungsdichte</option>
        )}
        {visualizationType === "heatmap" && (
          <option value="population">Bevölkerung</option>
        )}
        {visualizationType === "heatmap" && (
          <option value="volcanoes">Vulkane</option>
        )}
        {visualizationType === "heatmap" && (
          <option value="earthquakes">Erdbeben</option>
        )}
        {visualizationType === "heatmap" && <option value="BIP">GDP</option>}
      </select>

      {/* Umschalten der Datenanzeige */}
      <label htmlFor="show-data-checkbox" className="mb-2 font-bold text-sm">
        Daten anzeigen:
      </label>
      <input
        type="checkbox"
        id="show-data-checkbox"
        checked={showData}
        onChange={(e) => setShowData(e.target.checked)}
        className="p-2 rounded bg-gray-700 text-white mb-4"
      />

      {/* Schieberegler für Rotationsgeschwindigkeit */}
      <label htmlFor="rotation-speed-slider" className="mb-2 font-bold text-sm">
        Rotation:
      </label>
      <input
        type="range"
        id="rotation-speed-slider"
        min="0"
        max="2"
        step="0.1"
        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
        className="p-2 rounded w-full bg-gray-700 text-white mb-4"
      />

      {/* Auswahl des Visualisierungstyps */}
      <label
        htmlFor="visualization-type-select"
        className="mb-2 font-bold text-sm"
      >
        Visualisierungstyp:
      </label>
      <select
        id="visualization-type-select"
        value={visualizationType}
        onChange={(e) => setVisualizationType(e.target.value)}
        className="p-2 rounded w-full bg-transparent text-xs border border-gray-300"
      >
        <option value="polygon">Polygon</option>
        <option value="heatmap">Heatmap</option>
        <option value="CableGlobe">CableGlobe</option>
      </select>
    </div>
  );

  return (
    <>
      {/* Button für mobile Ansicht */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-5 right-5 bg-glass text-white p-4 rounded-full shadow-lg z-50"
      >
        ⚙️ Einstellungen
      </button>

      {/* Modal für mobile Ansicht */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-glass rounded-lg shadow-lg w-11/12 max-w-md p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Einstellungen</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖️
              </button>
            </div>

            {/* Modal Inhalt */}
            <SettingsContent />
          </div>
        </div>
      )}

      {/* Sidebar für Desktop- und Tablet-Ansicht */}
      <div className="hidden md:flex flex-col justify-start items-start absolute left-1 z-50 top-[10.5%] bg-glass rounded-br-3xl shadow-lg p-6">
        <SettingsContent />
      </div>
    </>
  );
}

export default Input;
