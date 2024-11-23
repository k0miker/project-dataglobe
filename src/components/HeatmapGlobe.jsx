import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import { useAppContext } from "../context/AppContext";
import background from "../assets/images/background.png";

function HeatmapGlobe() {
  const { selectedWorld, rotationSpeed } = useAppContext();
  const globeEl = useRef();
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        console.log("Fetching heatmap data...");
        const response = await fetch("/assets/data/world_population.csv");
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.statusText);
        }
        const csvText = await response.text();
        console.log("CSV Text:", csvText); // Debugging log
        const data = d3.csvParse(csvText, ({ lat, lng, pop }) => {
          const parsedLat = parseFloat(lat);
          const parsedLng = parseFloat(lng);
          const parsedPop = parseFloat(pop);
          if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedPop)) {
            console.error("Invalid data:", { lat, lng, pop });
          }
          return {
            lat: parsedLat,
            lng: parsedLng,
            pop: parsedPop,
          };
        });
        console.log("Parsed Heatmap Data:", data); // Debugging log
        setHeatmapData(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Heatmap-Daten:", error);
      }
    };
    fetchHeatmapData();
  }, []);

  useEffect(() => {
    console.log("Heatmap data updated:", heatmapData); // Debugging log
  }, [heatmapData]);

  return (
    <div className="w-full h-full absolute overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        heatmapData={heatmapData}
        heatmapPointLat="lat"
        heatmapPointLng="lng"
        heatmapPointWeight="pop"
        heatmapBandwidth={0.9}
        heatmapColorSaturation={2.8}
        enablePointerInteraction={false}
      />
    </div>
  );
}

export default HeatmapGlobe;