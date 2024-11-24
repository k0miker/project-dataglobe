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
    clouds,
    setClouds,
    dataOption,
  } = useAppContext();
  const [countries, setCountries] = useState([]);

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

  return (
    <div className="flex flex-col justify-start items-start  absolute left-1 z-50 hover:bottom-[10%] top-[10.5%] bg-glass rounded-br-3xl shadow-lg p-6">
      <label htmlFor="world-select" className="mb-2 font-bold text-sm">
        Karte:
      </label>
      <select
        id="world-select"
        value={selectedWorld}
        onChange={(e) => setSelectedWorld(e.target.value)}
        className="p-2 rounded w-1/2 bg-transparent text-xs border border-gray-300"
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

      <label
        htmlFor="data-option-select"
        className="mt-4 mb-2 font-bold text-sm"
      >
        Datenoption:
      </label>
      <select
        id="data-option-select"
        value={dataOption}
        onChange={(e) => setDataOption(e.target.value)}
        className="p-2 rounded w-1/2 bg-transparent text-xs border border-gray-300"
      >
        {visualizationType === "polygon" && (
          <option value="gdp">BIP pro Kopf</option>
        )}{" "}
        {visualizationType === "polygon" && (
          <option value="density">Bevölkerungsdichte</option>
        )}
        {visualizationType === "heatmap" && (
          <option value="population">Bevölkerung</option>
        )}
        {visualizationType === "heatmap" && (
          <option value="volcanoes">Vulkane</option>
        )}
        {visualizationType === "heatmap" && <option value="earthquakes">Erdbeben</option>}
        {visualizationType === "heatmap" && <option value="BIP">GDP</option>}

      </select>

      <label
        htmlFor="show-data-checkbox"
        className="mt-4 mb-2 font-bold text-sm"
      >
        Daten anzeigen:
      </label>
      <input
        type="checkbox"
        id="show-data-checkbox"
        checked={showData}
        onChange={(e) => setShowData(e.target.checked)}
        className="p-2 rounded bg-gray-700 text-white accent-color"
      />

      <label
        htmlFor="rotation-speed-slider"
        className="mt-4 mb-2 font-bold text-sm"
      >
        Rotation:
      </label>
      <input
        type="range"
        id="rotation-speed-slider"
        min="0"
        max="2"
        step="0.1"
        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
        className="p-2 rounded w-1/2 bg-gray-700 text-white accent-color"
      />

      <label
        htmlFor="visualization-type-select"
        className="mt-4 mb-2 font-bold text-sm"
      >
        Visualisierungstyp:
      </label>
      <select
        id="visualization-type-select"
        value={visualizationType}
        onChange={(e) => setVisualizationType(e.target.value)}
        className="p-2 rounded w-1/2 bg-transparent text-xs border border-gray-300"
      >
        <option value="polygon">Polygon</option>
        <option value="heatmap">Heatmap</option>
        <option value="CableGlobe">CableGlobe</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
}

export default Input;
