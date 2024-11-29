import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";
import InputSelect from "./Input_select";
import InputSlider from "./Input_slider";
import InputCheckbox from "./Input_checkbox";
import { Tooltip as ReactTooltip } from "react-tooltip"; // Import Tooltip

function Input() {
  // Verwendung des AppContext
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
    colorScheme,
    setColorScheme,
    heatmapTopAltitude,
    setHeatmapTopAltitude,
    heatmapBandwidth,
    setHeatmapBandwidth,
    rotationSpeed, 
    maxPolygonAltitude,
    setMaxPolygonAltitude,
    clouds, setClouds,
  } = useAppContext();

  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State für Modal

  const handleSliderChange = (setter, value) => {
    setter(value);
  };

  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

  const showTooltip = (text, x, y) => {
    setTooltip({ visible: true, text, x, y });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  // Länderdaten abrufen
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

  // Standarddatenoptionen für Visualisierungstypen festlegen
  useEffect(() => {
    if (visualizationType === "heatmap") {
      setDataOption("population");
    } else if (visualizationType === "polygon") {
      setDataOption("gdp");
    }
  }, [visualizationType]);

  // Tooltip-Komponente
  const Tooltip = ({ text, x, y }) => (
    <div
      className="absolute bg-gray-700 text-white text-xs rounded py-1 px-2 z-50"
      style={{ top: y + 10, left: x + 10, maxWidth: '200px', whiteSpace: 'normal' }}
    >
      {text}
    </div>
  );

  // Einstellungen-UI-Komponente (wird in Sidebar und Modal verwendet)
  const SettingsContent = () => (
    <>
      <div className="p-6 relative">
      <h1 className="mb-2 ">⚙️ Einstellungen</h1>
        <InputSelect
          label="Kartentyp:"
          value={selectedWorld}
          onChange={(e) => setSelectedWorld(e.target.value)}
          options={[
            ["Dark", "earthDark.png"],
            ["Blue Marble", "earthMarble.png"],
            ["Night", "earthNight.jpg"],
            ["Rivers", "earthWater.png"],
            ["Rivers B&W", "earthWaterBW.png"],
            ["Topology", "earthTopology.png"],
            ["Continets", "earthOcean.webp"],
            ["Tectonic", "earthTectonic.jpg"],
            ["Ultra Resolution", "earthUltra.jpg"],
          ]}
          tooltip="Wählen Sie den Kartentyp aus, der angezeigt werden soll."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        <InputSelect
          label="Datenoption:"
          value={dataOption}
          onChange={(e) => setDataOption(e.target.value)}
          options={
            visualizationType === "polygon"
              ? [
                  ["BIP pro Kopf", "gdp"],
                  ["Bevölkerungsdichte", "density"],
                  ["Sterblichkeit", "mortality"],
                  ["Schulden", "debt"],
                  ["Inflation", "inflation"],
                  ["Beschäftigungsrate", "employment"],
                  ["Gesundheitsausgaben", "health"], // Neue Datenoption
                  ["Wirtschaftswachstum", "growth"], // Neue Datenoption
                ]
              : visualizationType === "heatmap"
              ? [
                  ["Bevölkerung", "population"],
                  ["Vulkane", "volcanoes"],
                  ["GDP", "gdp"],
                  ["Erdbeben", "earthquakes"], 
                ]
              : [["Kabel", "cable"]]
          }
          tooltip="Wählen Sie die Datenoption aus, die auf der Karte angezeigt werden soll."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        <InputSelect
          label="Darstellungsart:"
          value={visualizationType}
          onChange={(e) => setVisualizationType(e.target.value)}
          options={[
            ["Polygon", "polygon"],
            ["Heatmap", "heatmap"],
            ["CableGlobe", "CableGlobe"],
          ]}
          tooltip="Wählen Sie den Visualisierungstyp für die Daten aus, der auf der Karte angezeigt werden soll."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        {visualizationType !== "heatmap" && (
          <InputSelect
            label="Farbschema:"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            options={[
              ["Reds", "Reds"],
              ["Blues", "Blues"],
              ["Greens", "Greens"],
              ["Purples", "Purples"],
              ["Oranges", "Oranges"],
            ]}
            tooltip="Wählen Sie das Farbschema für die Visualisierung aus."
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        )}

        <InputCheckbox
          label="Daten zeigen:"
          checked={showData}
          onChange={(e) => setShowData(e.target.checked)}
          tooltip="Schalten Sie die Anzeige der Daten auf der Karte ein oder aus."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        <InputCheckbox
          label="Umrisse zeigen:"
          checked={showBorders}
          onChange={(e) => setShowBorders(e.target.checked)}
          tooltip="Schalten Sie die Anzeige der Länderumrisse auf der Karte ein oder aus."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        {/* <InputCheckbox
          label="Wolken zeigen:"
          checked={clouds}
          onChange={(e) => setClouds(e.target.checked)}
          tooltip="Schalten Sie die Anzeige der Wolken auf der Karte ein oder aus."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        /> */}

        <InputSlider
          label="Rotation:"
          value={rotationSpeed}
          onChange={(e) => handleSliderChange(setRotationSpeed, parseFloat(e.target.value))}
          min={0}
          max={0.5}
          step={0.01}
          tooltip="Stellen Sie die Rotations-geschwindigkeit der Karte ein."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        {visualizationType === "polygon" && (
          <InputSlider
            label="Max Polygon Höhe:"
            value={maxPolygonAltitude}
            onChange={(e) => handleSliderChange(setMaxPolygonAltitude, parseFloat(e.target.value))}
            min={0.006}
            max={0.5}
            step={0.01}
            tooltip="Stellen Sie die maximale Höhe der Polygone auf der Karte ein."
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        )}

        {visualizationType === "heatmap" && (
          <>
            <InputSlider
              label="Altitude:"
              value={heatmapTopAltitude}
              onChange={(e) => handleSliderChange(setHeatmapTopAltitude, parseFloat(e.target.value))}
              min={0.3}
              max={1.5}
              step={0.1}
              tooltip="Stellen Sie die Höhe der Heatmap auf der Karte ein."
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
            <InputSlider
              label="Bandwidth:"
              value={heatmapBandwidth}
              onChange={(e) => handleSliderChange(setHeatmapBandwidth, parseFloat(e.target.value))}
              min={0.3}
              max={1.5}
              step={0.1}
              tooltip="Stellen Sie die Bandbreite der Heatmap auf der Karte ein."
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
          </>
        )}
      </div>
      {tooltip.visible && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
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
              <h2 className="text-lg font-bold">Einstellungen</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-100 hover:text-red-700"
              >
                ✖ 
              </button>
            </div>

            {/* Modal Inhalt */}
            <SettingsContent />
          </div>
        </div>
      )}

      {/* Sidebar für Desktop- und Tablet-Ansicht */}
      <div className="hidden h-full  md:flex flex-col max-w-auto absolute  items-between left-0 z-50 top-[10%] bg-glass  shadow-lg">
        <SettingsContent />
      </div>
    </>
  );
}

export default Input;
