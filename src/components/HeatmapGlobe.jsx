import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import { useAppContext } from "../context/AppContext";
import { fetchGDPDataForCountries, fetchVolcanoes } from "../utils/fetches"; // Importieren der fehlenden Funktionen
import background from "../assets/images/background.png";
import LoadingSpinner from "./LoadingSpinner";
import Moon from "./Moon";
import Sun from "./Sun";

function HeatmapGlobe() {
  const { selectedWorld, rotationSpeed, dataOption = "population", geoJsonData, gdpData, showBorders, colorScheme, showData, heatmapTopAltitude, heatmapBandwidth, earthQuakeData, mortalityData, debtData, inflationData, employmentData, healthData, growthData, showGrid } = useAppContext();
  const globeEl = useRef();
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
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
              return { lat: parsedLat, lng: parsedLng, value: parsedPop };
            });
          } else if (dataOption === "gdp" && gdpData) {
            data = gdpData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: Math.max(Number((country.gdp / 5000000).toFixed(0)), 1),
            }));
          } else if (dataOption === "volcanoes") {
            data = await fetchVolcanoes();
          } else if (dataOption === "earthquakes" && earthQuakeData.length > 0) {
            data = earthQuakeData.map((quake) => ({
              lat: quake.latitude,
              lng: quake.longitude,
              value: quake.magnitude * 1000000000,
            }));
          } else if (dataOption === "mortality") {
            data = mortalityData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: country.value * 10,
            }));
          } else if (dataOption === "debt") {
            data = debtData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: country.value,
            }));
          } else if (dataOption === "inflation") {
            data = inflationData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: Math.min(country.value, 1000) * 10,
            }));
          } else if (dataOption === "employment") {
            data = employmentData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: country.value,
            }));
          } else if (dataOption === "health") {
            data = healthData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: country.value,
            }));
          } else if (dataOption === "growth") {
            data = growthData.map((country) => ({
              lat: country.latitude,
              lng: country.longitude,
              value: country.value,
            }));
          }
          localStorage.setItem(`heatmapData_${dataOption}`, JSON.stringify(data));
        }

        const validData = (data || []).filter(
          (d) => d && !isNaN(d.lat) && !isNaN(d.lng) && d.lat >= -90 && d.lat <= 90 && d.lng >= -180 && d.lng <= 180
        );

        const maxVal = d3.max(validData, (d) => d.value);
        const normalizedData = validData.map((d) => ({
          ...d,
          value: d.value / maxVal,
        }));

        setTimeout(() => {
          setHeatmapData(normalizedData);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Fehler beim Abrufen der Heatmap-Daten:", error);
        setLoading(false);
      }
    };

    // Neuen Zustand beim Daten-Typ-Wechsel setzen:
    setLoading(true);
    setHeatmapData([]);
    fetchHeatmapData();
  }, [dataOption, colorScheme]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  // Farbskala
  const colorScale = useMemo(() => {
    //console.log("Setting color scale for color scheme:", colorScheme);
    return d3.scaleSequentialSqrt(d3[`interpolate${colorScheme}`]).domain([0, 0.5]); 
  }, [colorScheme]);

  return (
    <div className="">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={selectedWorld} // Globus-Hintergrund
        backgroundImageUrl={background} // Hintergrundbild
        heatmapsData={loading || !showData ? [] : [heatmapData]} // Heatmap-Daten (Plural) (Array)
        heatmapPointLat="lat" // Breitengrad
        heatmapPointLng="lng" // Längengrad
        heatmapPointWeight={d => d.value} // Gewichtung der Punkte
        heatmapBandwidth={heatmapBandwidth} // Bandbreite erhöhen
        heatmapSizeAttenuation={dataOption === "BIP" ? 0.1 : 0.5}
        heatmapTopAltitude={heatmapTopAltitude}
        heatmapAltitude={(d) => d.value * 0.0025} // Höhe 
        heatmapBaseAltitude={0.01} // Basis-Höhe
        heatmapColorSaturation={1.0} // Weniger kräftige Farben
        enablePointerInteraction={false}
        heatmapSize={.7} // Größe der Heatmap-Punkte erhöhen
        heatmapColorScale={(value) => colorScale(value)} // Farbskala
        showAtmosphere={true} // Atmosphäre anzeigen
        atmosphereAltitude={0.2} // Atmosphärenhöhe
        showGraticules={showGrid} // Grid anzeigen oder ausblenden
        polygonsData={geoJsonData} // GeoJSON-Daten für Länderumrisse
        polygonCapColor={() => "rgba(0, 0, 0, 0)"} // Keine Füllfarbe
        polygonSideColor={() => "rgba(0, 0, 0, 0)"} // Keine Seitenfarbe
        polygonStrokeColor={() => (showBorders ? "#FFFFFF" : "rgba(0, 0, 0, 0)")} // Stroke-Farbe
        polygonsTransitionDuration={300}
        polygonAltitude={() => (showData ? 0.01 : 0)} // Keine Höhe, wenn showData aus ist
        polygonLabel={showData ? ({ properties: d }) => `
          <div class="globe-label">
            <b>${d.ADMIN} (${d.ISO_A2}):</b> <br /> <br />
            Bevölkerung:  <br /><i>${(d.POP_EST / 1e6).toFixed(2)} Mio</i><br/>
            GDP:  <br /><i>${(d.GDP_MD_EST / 1e3).toFixed(2)} Mrd. $</i><br>
            Economy: <br /> <i>${d.ECONOMY}</i>
           <br> <i>${d.INCOME_GRP}</i>
          </div>
        ` : null} // Keine Labels, wenn showData aus ist
      />
      <Moon scene={globeEl.current?.scene()} />
      <Sun scene={globeEl.current?.scene()} />
    </div>
  );
}

export default HeatmapGlobe;
