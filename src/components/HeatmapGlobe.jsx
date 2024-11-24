import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import { useAppContext } from "../context/AppContext";
import background from "../assets/images/background.png";

function HeatmapGlobe() {
  const { selectedWorld, rotationSpeed } = useAppContext();
  const globeEl = useRef();
  const [heatmapData, setHeatmapData] = useState([]);

  // Heatmap-Daten abrufen
  const fetchHeatmapData = async () => {
    try {
      const response = await fetch("/world_population.csv");
      if (!response.ok) {
        throw new Error(
          "Network response was not ok: " + response.statusText
        );
      }
      const csvText = await response.text();
      const data = d3.csvParse(csvText, ({ lat, lng, pop }) => {
        const parsedLat = parseFloat(lat.trim());
        const parsedLng = parseFloat(lng.trim());
        const parsedPop = parseFloat(pop.trim());
        if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedPop) || parsedPop < 1e6) {
          return null;
        }
        return {
          lat: parsedLat,
          lng: parsedLng,
          pop: parsedPop,
        };
      });

      const validData = data.filter(
        (d) =>
          d && d.lat >= -90 && d.lat <= 90 && d.lng >= -180 && d.lng <= 180
      );

      const maxPop = d3.max(validData, (d) => d.pop);
      const normalizedData = validData.map((d) => ({
        ...d,
        pop: d.pop / maxPop, // Normalisierung
      }));

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
  }, []);

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
        heatmapPointWeight="pop" // Gewicht
        heatmapBandwidth={1.2} // Kleinere Bandbreite
        heatmapColorSaturation={2.0} // Weniger kräftige Farben
        enablePointerInteraction={false}
        heatmapSize={0.5} // Größe der Heatmap-Punkte
        heatmapColorScale={(pop) => colorScale(pop)} // Farbskala
        showAtmosphere={true} // Atmosphäre anzeigen
        atmosphereAltitude={0.2} // Atmosphärenhöhe
        showGraticules={true} // Längen- und Breitengrade anzeigen
        heatmapAltitude={(d) => d.pop * 0.1} // 3D Höhe der Heatmap-Punkte
      />
    </div>
  );
}

export default HeatmapGlobe;
