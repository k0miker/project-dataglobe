import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import { useAppContext } from "../context/AppContext";
import background from "../assets/images/background.png";

function HeatmapGlobe() {
  const { selectedWorld, rotationSpeed, dataOption = "population", geoJsonData, gdpData, setGdpData, showBorders, colorScheme } = useAppContext();
  const globeEl = useRef();
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Heatmap-Daten abrufen
  const fetchHeatmapData = async () => {
    try {
      console.log("Fetching heatmap data for option:", dataOption);
      setLoading(true);
      let data = [];
      const cachedData = localStorage.getItem(`heatmapData_${dataOption}`);
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
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
          const response = await fetch("/extendedGdpData.json");
          const gdpData = await response.json();
          data = gdpData.map((country) => ({
            lat: country.latitude,
            lng: country.longitude,
            value: Math.max(Number((country.gdp / 5000000).toFixed(0)), 1), // Minimalwert weiter anheben
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
        localStorage.setItem(`heatmapData_${dataOption}`, JSON.stringify(data));
      }

      const validData = (data || []).filter(
        (d) =>
          d && !isNaN(d.lat) && !isNaN(d.lng) && d.lat >= -90 && d.lat <= 90 && d.lng >= -180 && d.lng <= 180
      );

      const maxVal = d3.max(validData, (d) => d.value);
      const normalizedData = validData.map((d) => ({
        ...d,
        value: d.value / maxVal, // Normalisierung
      }));

      setHeatmapData(normalizedData);
      setLoading(false);
      console.log("Heatmap data fetched successfully.");
    } catch (error) {
      console.error("Fehler beim Abrufen der Heatmap-Daten:", error);
      setLoading(false);
    }
  };

  // Globus-Rotation steuern
  useEffect(() => {
    console.log("Setting rotation speed:", rotationSpeed);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  useEffect(() => {
    console.log("Fetching heatmap data for data option:", dataOption);
    fetchHeatmapData();
  }, [dataOption, colorScheme]);

  // Farbskala
  const colorScale = useMemo(() => {
    console.log("Setting color scale for color scheme:", colorScheme);
    return d3.scaleSequentialSqrt(d3[`interpolate${colorScheme}`]).domain([0, 0.5]); // Flacherer Verlauf
  }, [colorScheme]);

  return (
    <div className="w-full h-full absolute overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld} // Globus-Hintergrund
        backgroundImageUrl={background} // Hintergrundbild
        heatmapsData={loading ? [] : [heatmapData]} // Heatmap-Daten (Plural) (Array)
        heatmapPointLat="lat" // Breitengrad
        heatmapPointLng="lng" // Längengrad
        heatmapPointWeight={d => d.value * (dataOption === "BIP" ? 300 : 0.5)} // Gewicht erhöhen
        heatmapBandwidth={dataOption === "BIP" ? 1.8 : 1.5} // Bandbreite erhöhen
        heatmapTopAltitude={0.5}
        heatmapSizeAttenuation={dataOption === "BIP" ? 0.1 : 0.5}
        heatmapBaseAltitude={0.01} // Basis-Höhe
        heatmapColorSaturation={1.0} // Weniger kräftige Farben
        enablePointerInteraction={false}
        heatmapSize={0.7} // Größe der Heatmap-Punkte erhöhen
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
