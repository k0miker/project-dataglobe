import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";
import InputSelect from "./Input_select";
import InputSlider from "./Input_slider";
import InputCheckbox from "./Input_checkbox";

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
    showGrid,
    setShowGrid,
    cableColorSet,
    setCableColorSet, // Hinzufügen der Zustände für das Farbset
  } = useAppContext();

  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State für Modal

  const handleSliderChange = (setter, value) => {
    setter(value);
  };

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

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
      style={{
        top: y + 10,
        left: x + 10,
        maxWidth: "200px",
        whiteSpace: "normal",
      }}
    >
      {text}
    </div>
  );

  // Einstellungen-UI-Komponente (wird in Sidebar und Modal verwendet)
  const SettingsContent = () => (
    <>
      <div className="p-6 relative">
      <h1 className=" pb-4 w-full flex justify-between font-bold">Settings</h1>
        <InputSelect
          id="earth-groundlayer"
          label="Groundlayer:"
          value={selectedWorld}
          onChange={(e) => setSelectedWorld(e.target.value)}
          options={[
            ["Dark", "earthDark.png"],
            ["Blue Marble", "earthMarble.png"],
            ["Night", "earthNight.jpg"],
            ["Rivers", "earthWater.png"],
            ["Topology", "earthTopology.png"],
            ["Tectonic", "earthTectonic.jpg"],
            ["Ultra Resolution", "earthUltra.jpg"],
          ]}
          tooltip="Select the map type to display as ground layer."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        <InputSelect
          id="data-option"
          label="Data Option:"
          value={dataOption}
          onChange={(e) => setDataOption(e.target.value)}
          options={
            visualizationType === "polygon"
              ? [
                  ["GDP per Capita", "gdp"],
                  ["Population Density", "density"],
                  ["Mortality", "mortality"],
                  ["Debt", "debt"],
                  ["Inflation", "inflation"],
                  ["Unemployment Rate", "employment"],
                  ["Health Expenditure", "health"],
                  ["Economic Growth", "growth"],
                  ["Internet-Cables", "cable"],
                ]
              : visualizationType === "heatmap"
              ? [
                  ["GDP", "gdp"],
                  ["Population", "population"],
                  ["Volcanoes", "volcanoes"],
                  ["Earthquakes", "earthquakes"],
                  ["Internet-Cables", "cable"],
                ]
              : [["Kabel", "cable"]]
          }
          tooltip="Select the data option to vizualize on the map."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        <InputSelect
          id="visualization-type"
          label="Visualization:"
          value={visualizationType}
          onChange={(e) => setVisualizationType(e.target.value)}
          options={[
            ["Countries", "polygon"],
            ["Heatmap", "heatmap"],
          ]}
          tooltip="Select the visualization type for the data in witch it should be displayed on the map."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        {visualizationType !== "heatmap" && (
          <InputSelect
            id="color-scheme"
            label="Color Scheme:"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            options={[
              ["Reds", "Reds"],
              ["Blues", "Blues"],
              ["Greens", "Greens"],
              ["Purples", "Purples"],
              ["Oranges", "Oranges"],
            ]}
            tooltip="Select the color scheme for the visualization."
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        )}

        <InputCheckbox
          id="show-data"
          label="Show Data:"
          checked={showData}
          onChange={(e) => setShowData(e.target.checked)}
          tooltip="Toggle the display of data on the map."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        {dataOption !== "cable" && (
          <InputCheckbox
            id="show-borders"
            label="Show Borders:"
            checked={showBorders}
            onChange={(e) => setShowBorders(e.target.checked)}
            tooltip="Toggle the display of country borders on the map."
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        )}

        <InputCheckbox
          id="show-grid"
          label="Show Grid:"
          checked={showGrid}
          onChange={(e) => setShowGrid(e.target.checked)}
          tooltip="Toggle the display of the grid on the map."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        <InputSlider
          id="rotation-speed"
          label="Rotation:"
          value={rotationSpeed}
          onChange={(e) =>
            handleSliderChange(setRotationSpeed, parseFloat(e.target.value))
          }
          min={0}
          max={0.5}
          step={0.01}
          tooltip="Adjust the rotation speed of the map."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

        {visualizationType === "polygon" && dataOption !== "cable" && (
          <InputSlider
            id="max-height"
            label="Max height:"
            value={maxPolygonAltitude}
            onChange={(e) =>
              handleSliderChange(
                setMaxPolygonAltitude,
                parseFloat(e.target.value)
              )
            }
            min={0.006}
            max={0.5}
            step={0.01}
            tooltip="Adjust the maximum height of the countries on the map considering the data."
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        )}

        {visualizationType === "heatmap" && dataOption !== "cable" && (
          <>
            <InputSlider
              id="heatmap-altitude"
              label="Altitude:"
              value={heatmapTopAltitude}
              onChange={(e) =>
                handleSliderChange(
                  setHeatmapTopAltitude,
                  parseFloat(e.target.value)
                )
              }
              min={0.1}
              max={1.5}
              step={0.1}
              tooltip="Adjust the altitude of the heatmap on the map."
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
            <InputSlider
              id="heatmap-bandwidth"
              label="Bandwidth:"
              value={heatmapBandwidth}
              onChange={(e) =>
                handleSliderChange(
                  setHeatmapBandwidth,
                  parseFloat(e.target.value)
                )
              }
              min={0.8}
              max={1.8}
              step={0.1}
              tooltip="Adjust the bandwidth of the heatmap on the map."
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
          </>
        )}

        <InputSelect
          id="cable-color-set"
          label="Cable Color Set:"
          value={cableColorSet}
          onChange={(e) => setCableColorSet(e.target.value)}
          options={[
            ["Default", "default"],
            ["Rainbow", "rainbow"],
            ["Monochrome", "monochrome"],
            ["Blues", "blues"],
            ["Reds", "reds"],
            ["Greens", "greens"],
          ]}
          tooltip="Select the color set for the cables."
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />

      </div>
      {tooltip.visible && (
        <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />
      )}
    </>
  );

  return (
    <>
      {/* Button für mobile Ansicht */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-5 left-5 bg-glass text-xs text-white p-4 rounded-full shadow-lg z-50"
      >
        ⚙️ Settings
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
            <div className="flex justify-end items-center mb-4">
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
      <div className="hidden h-full md:flex flex-col max-w-[180px] absolute  items-between left-0  duration-500 z-50 top-[10%] bg-glass shadow-lg">
        <SettingsContent />
      </div>
    </>
  );
}

export default Input;
