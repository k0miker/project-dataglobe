import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import { useAppContext } from "../context/AppContext";
import background from "../assets/images/background.png";

function HeatmapGlobe() {
  const { selectedWorld, rotationSpeed, dataOption = "population", geoJsonData, gdpData, showBorders } = useAppContext();
  const globeEl = useRef();
  const [heatmapData, setHeatmapData] = useState([]);

  // Heatmap-Daten abrufen
  const fetchHeatmapData = async () => {
    try {
      let data = [];
      console.log("fetchHeatmapData called with dataOption:", dataOption);
      if (dataOption === "population") {
        const response = await fetch("/world_population.csv");
        const csvText = await response.text();

        data = d3.csvParse(csvText, ({ lat, lng, pop }) => {
          const parsedLat = parseFloat(lat.trim());
          const parsedLng = parseFloat(lng.trim());
          const parsedPop = parseFloat(pop.trim());
          if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedPop) || parsedPop < 1e6) {
            return null;
          }
          return {
            lat: parsedLat,
            lng: parsedLng,
            value: parsedPop,
          };
        });
      } else if ((dataOption === "gdp" || dataOption === "BIP") && Array.isArray(gdpData)) {
        console.log("gdpData:", gdpData);
        data = gdpData.map(entry => ({
          lat: entry.latitude,
          lng: entry.longitude,
          value: entry.gdp
        }));
      } else if (dataOption === "volcanoes") {
        const response = await fetch("/world_volcanoes.json");
        const volcanoes = await response.json();
        data = volcanoes.map((volcano) => ({
          lat: volcano.lat,
          lng: volcano.lon,
          value: volcano.elevation,
        }));
      }

      console.log("raw data:", data);

      const validData = (data || []).filter(
        (d) =>
          d && !isNaN(d.lat) && !isNaN(d.lng) && d.lat >= -90 && d.lat <= 90 && d.lng >= -180 && d.lng <= 180
      );

      console.log("valid data:", validData);

      const maxVal = d3.max(validData, (d) => d.value);
      const normalizedData = validData.map((d) => ({
        ...d,
        value: d.value / maxVal, // Normalisierung
      }));

      console.log("normalized data:", normalizedData);

      setHeatmapData(normalizedData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Heatmap-Daten:", error);
    }
  };

  // Globus-Rotation steuern
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  useEffect(() => {
    fetchHeatmapData();
  }, [dataOption]);

  // Farbskala
  const colorScale = useMemo(() => {
    return d3.scaleSequentialSqrt(d3.interpolateReds).domain([0, 1]);
  }, []);

  return (
    <div className="w-full h-full absolute overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld} // Globus-Hintergrund
        backgroundImageUrl={background} // Hintergrundbild
        heatmapsData={[heatmapData]} // Heatmap-Daten (Plural) (Array)
        heatmapPointLat="lat" // Breitengrad
        heatmapPointLng="lng" // Längengrad
        heatmapPointWeight={d => d.value * 5e-5} // Gewicht
        heatmapBandwidth={1.2} // Kleinere Bandbreite
        heatmapTopAltitude={0.2}
        heatmapColorSaturation={2.0} // Weniger kräftige Farben
        enablePointerInteraction={false}
        heatmapSize={0.5} // Größe der Heatmap-Punkte
        heatmapColorScale={(value) => colorScale(value)} // Farbskala
        showAtmosphere={true} // Atmosphäre anzeigen
        atmosphereAltitude={0.2} // Atmosphärenhöhe
        showGraticules={true} // Längen- und Breitengrade anzeigen
        heatmapAltitude={(d) => d.value * 100.1} // 3D Höhe der Heatmap-Punkte
        polygonsData={geoJsonData} // GeoJSON-Daten für Länderumrisse
        polygonCapColor={() => "rgba(0, 0, 0, 0)"} // Keine Füllfarbe
        polygonSideColor={() => "rgba(0, 0, 0, 0)"} // Keine Seitenfarbe
        polygonStrokeColor={() => (showBorders ? "#FFFFFF" : "rgba(0, 0, 0, 0)")} // Stroke-Farbe
        polygonsTransitionDuration={300}
      />
    </div>
  );
}

export default HeatmapGlobe;
