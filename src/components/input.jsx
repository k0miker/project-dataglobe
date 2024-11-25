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
    showBorders,
    setShowBorders,
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
    <>
      {/* Auswahl der Karte */}
      <div className="p-6">
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
          ["Dark", "earthDark.png"],
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
      <label htmlFor="data-option-select" className="mb-2 font-bold text-sm text-left">
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
      <label htmlFor="show-data-checkbox" className="mb-2 font-bold text-sm flex items-center justify-start cursor-pointer">
        <span className="mr-2 text-xs">Daten zeigen:</span>
        <div className="relative">
          <input
            type="checkbox"
            id="show-data-checkbox"
            checked={showData}
            onChange={(e) => setShowData(e.target.checked)}
            className="sr-only"
          />
          <div className={`block ${showData ? 'bg-green-600' : 'bg-red-600'} w-7 h-4 rounded-full`}></div>
          <div
            className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition transform ${showData ? 'translate-x-full bg-red-500' : ''}`}
          ></div>
        </div>
      </label>

      {/* Umschalten der Länderumrisse */}
      <label htmlFor="show-borders-checkbox" className="mb-2 font-bold text-sm flex items-center justify-start cursor-pointer">
        <span className="mr-2 text-xs">Länderumrisse zeigen:</span>
        <div className="relative">
          <input
            type="checkbox"
            id="show-borders-checkbox"
            checked={showBorders}
            onChange={(e) => setShowBorders(e.target.checked)}
            className="sr-only"
          />
          <div className={`block ${showBorders ? 'bg-green-600' : 'bg-red-600'} w-7 h-4 rounded-full`}></div>
          <div
            className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition transform ${showBorders ? 'translate-x-full bg-red-500' : ''}`}
          ></div>
        </div>
      </label>

      {/* Schieberegler für Rotationsgeschwindigkeit */}
      <label htmlFor="rotation-speed-slider" className="mb-2 font-bold text-sm">
        Rotation:
      </label>
      <input
        type="range"
        id="rotation-speed-slider"
        min="-.5"
        max=".5"
        step="0.01"
        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
        className="p-2 rounded w-full bg-gray-700 text-white mb-4 accent-red-500 focus:ring-2 focus:ring-red-300"
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
    </>
      
 
  );

  return (
    <>
      {/* Button für mobile Ansicht */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-5 left-5 bg-glass text-white p-4 rounded-full shadow-lg z-50"
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
      <div className="hidden md:flex flex-col max-w-48 overflow-hidden   justify-start items-between absolute left-0 z-50 top-[10%] bg-glass rounded-br-3xl shadow-lg ">
        <SettingsContent />
      </div>
    </>
  );
}

export default Input;
