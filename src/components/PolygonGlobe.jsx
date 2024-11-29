import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import background from "../assets/images/background.png"; // Hintergrundbild
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";
import Moon from "./Moon";
import LoadingSpinner from "./LoadingSpinner";
import Sun from "./Sun";
import Clouds from "./Clouds";
import polygonLabel from "../utils/polygonLabel";
import getVal from "../utils/geoJsonUtils";

function PolygonGlobe() {
  const {
    selectedWorld,
    dataOption,
    showData,
    rotationSpeed,
    selectedCountry,
    setSelectedCountry,
    geoJsonData,
    showBorders,
    colorScheme,
    maxPolygonAltitude,
    setMaxPolygonAltitude,
    mortalityData,
    debtData,
    inflationData,
    employmentData,
    healthData,
    growthData,
  } = useAppContext();

  const minPolygonAltitude = 0.008; // Fester Wert für minPolygonAltitude
  const hoveredPolygonAltitude =  0.05; // Reduzierte Höhe für hoveredPolygonAltitude

  const globeEl = useRef(); // Referenz für den Globe
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [colorScale, setColorScale] = useState(() =>
    d3[`scaleSequentialSqrt`](d3[`interpolate${colorScheme}`]).domain([0, 1])
  );
  const [restCountriesData, setRestCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastCameraPosition, setLastCameraPosition] = useState({ lat: 0, lng: 0, altitude: 2 });

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

  // RestCountries Daten abrufen
  useEffect(() => {
    const getRestCountriesData = async () => {
      try {
        // console.log("Fetching RestCountries data...");
        setLoading(true);
        const data = await fetchCountries();
        setRestCountriesData(data);
        setLoading(false);
        // console.log("RestCountries data fetched successfully.");
      } catch (error) {
        console.error("Fehler beim Abrufen der RestCountries-Daten:", error);
        setLoading(false);
      }
    };
    getRestCountriesData();
  }, []);

  // GeoJSON Daten verarbeiten
  const processGeoJsonData = () => {
    // console.log("Processing GeoJSON data...");


    const maxVal = Math.max(...geoJsonData.map(feat => getVal(feat, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData)));
    // console.log("Max Value for Data Option:", maxVal); // Log für Maximalwert
    setColorScale(() =>
      d3[`scaleSequentialSqrt`](d3[`interpolate${colorScheme}`]).domain([
        0,
        maxVal * 0.8,
      ])
    ); // Intensivere Farben
    setCountriesData(geoJsonData);
    // console.log("GeoJSON data processed successfully.");
  };

  useEffect(() => {
    processGeoJsonData();
  }, [dataOption, restCountriesData, geoJsonData, colorScheme, debtData, inflationData, employmentData, healthData, growthData]);

  // Rotationsgeschwindigkeit einstellen
  useEffect(() => {
    // console.log("Setting rotation speed:", rotationSpeed);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
      globeEl.current.lights = ([]);
    }
  }, [rotationSpeed]);

  // Rotation stoppen, wenn ein Land ausgewählt ist
  useEffect(() => {
    // console.log("Selected country changed:", selectedCountry);
    if (selectedCountry && globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      setTimeout(() => {
        globeEl.current.controls().autoRotate = true;
      }, 5000);
    }
  }, [selectedCountry]);

  // Kameraanimation zum ausgewählten Land
  const animateCameraToCountry = (country) => {
    if (globeEl.current && country) {
      const { latlng } = country; // Längen- und Breitengrad des Landes
      const [lat, lng] = latlng;
      const altitude = 1;
      setLastCameraPosition(globeEl.current.pointOfView()); // Speichern der aktuellen Kameraposition
      globeEl.current.pointOfView({ lat, lng, altitude }, 1500); // Zoom auf das Land
      const timeoutId = setTimeout(() => {
        globeEl.current.pointOfView(lastCameraPosition, 1500); // Zurück zur letzten Kameraposition
      }, 5000); // Nach 5 Sekunden zurückzoomen

      // Clear timeout if user interacts with the globe
      const controls = globeEl.current.controls();
      const handleUserInteraction = () => {
        clearTimeout(timeoutId);
        controls.removeEventListener("start", handleUserInteraction);
      };

      controls.addEventListener("start", handleUserInteraction);
    }
  };

  // Reaktion auf Änderungen des ausgewählten Landes
  useEffect(() => {
    // console.log("Animating camera to country:", selectedCountry);
    animateCameraToCountry(selectedCountry);
  }, [selectedCountry, dimensions.width]);

  useEffect(
    (country) => {
      if (globeEl.current && country) {
        const { latlng } = country; // Längen- und Breitengrad des Landes
        const [lat, lng] = latlng;
        globeEl.current.pointOfView(
          { lat, lng, altitude: dimensions.width / 100000 },
          500
        );
      }
      if (dimensions.width < 768) {
        globeEl.current.pointOfView(
          { lat: 0, lng: 0, altitude: dimensions.width / 100 },
          500
        );
      } else {
        globeEl.current.pointOfView(
          { lat: 0, lng: 0, altitude: dimensions.width / 400 },
          500
        );
      }
    },
    [dimensions.width]
  );

  useEffect(() => {
    // console.log("Setting color scale for color scheme:", colorScheme);
    setColorScale(() =>
      d3[`scaleSequentialSqrt`](d3[`interpolate${colorScheme}`]).domain([0, 1])
    );
    processGeoJsonData(); // Re-parse data when color scheme changes
  }, [colorScheme]);

  useEffect(() => {
    const controls = globeEl.current.controls();
    const handleUserInteraction = () => {
      if (controls.autoRotate) {
        controls.autoRotate = false;
        setTimeout(() => {
          controls.autoRotate = true;
        }, 5000);
      }
    };

    controls.addEventListener("start", handleUserInteraction);
    return () => {
      controls.removeEventListener("start", handleUserInteraction);
    };
  }, []);

  const handleCountryClick = (clickedCountry, event) => {
    event.stopPropagation(); // Prevent deselecting when clicking on a country
    const country = restCountriesData.find(
      (country) => country.cca3 === clickedCountry.properties.ISO_A3
    );
    if (country) {
      setSelectedCountry((prevCountry) =>
        prevCountry?.cca3 === country.cca3 ? null : country
      ); // Deselect if clicking on the same country again
      animateCameraToCountry(country); // Animate camera to the clicked country
    }
  };

  const simulateMaxPolygonAltitude = () => {
    setMaxPolygonAltitude(2);
    setTimeout(() => {
      setMaxPolygonAltitude(0.008);
    }, 3000);
  };

  useEffect(() => {
    simulateMaxPolygonAltitude();
  }, [ dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData]);

  return (
    <div
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
      onClick={() => setSelectedCountry(null)} // Deselect country on empty space click
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        showGraticules={true}
        atmosphereAltitude={0.2}
        atmosphereColor={"#bee7ff"}
        polygonsData={countriesData}
        polygonCapColor={(feat) => {
          if (!showData) return "rgba(0, 0, 0, 0)"; // Transparent, wenn showData aus ist
          if (!showData && feat !== hoveredCountry && feat !== selectedCountry)
            return "rgba(0, 0, 0, 4)";
          if (!showData && feat === hoveredCountry)
            return "rgba(188, 188, 188, 0.522)";
          if (!showData && feat === selectedCountry)
            return "rgba(255, 255, 255, 0.522)";
          if (!showData) return null;
          const color = d3.color(colorScale(getVal(feat, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData)));
          const alpha = getVal(feat, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData) / colorScale.domain()[1];
          color.opacity = alpha * 3; // Transparenz anpassen
          if (feat === hoveredCountry) return "rgba(255, 255, 255, 0.5)"; // Weiß mit 50% Alpha für gehovtetes Land
          return feat === selectedCountry
            ? color.formatRgb()
            : color.formatRgb();
        }}
        polygonSideColor={() => {
          if (showData) return "rgba(0, 0, 0, 0.522)";
          if (showData && showBorders) return "rgba(0, 0, 0, 0.522)";
          return null;
        }}
        polygonStrokeColor={(feat) => {
          if (
            !showBorders ||
            (!showData && feat !== hoveredCountry && feat !== selectedCountry)
          )
            return "rgba(0, 0, 0, 0)";
          if(showBorders)return "rgba(0, 0, 0, 0.522)";
          return feat === hoveredCountry ||
            feat.properties.ISO_A3 === selectedCountry?.cca3
            ? "#FFFFFF"
            : null;
        }}
        polygonAltitude={(d) => {
          if (!showBorders && !showData) return -1;
          const baseAltitude = getVal(d, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData) / colorScale.domain()[1] * (maxPolygonAltitude - minPolygonAltitude) + minPolygonAltitude;
          if (d.properties.ISO_A3 === selectedCountry?.cca3) return baseAltitude + 0.1; // Erhöhe die Höhe des ausgewählten Landes um 0.2
          if (d === hoveredCountry && showData) return hoveredPolygonAltitude+baseAltitude; // Heben des gehovteten Landes
          if (showData) return baseAltitude; // Höhe im Verhältnis zum Wert
          return minPolygonAltitude; // Standardhöhe
        }}
        polygonStrokeAltitude={(d) => {
          if (d.properties.ISO_A3 === selectedCountry?.cca3) return 0.1; // Heben der Umrandung des ausgewählten Landes
          if (d === hoveredCountry && showData) return 0.1; // Heben der Umrandung des gehovteten Landes
          if (d.properties.ISO_A3 === selectedCountry?.cca3) return 0.1; // Heben der Umrandung des ausgewählten Landes
          if (d === hoveredCountry && showData) return 0.1; // Heben der Umrandung des gehovteten Landes
          if (showBorders && !showData) return 1; // Höhe der Umrandung
          return showData ? 0.01 : -0.008; // Keine Höhe, wenn showData aus ist
        }}
        polygonsTransitionDuration={2800}
        polygonLabel={(d) => polygonLabel(d, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData)}
        
        onPolygonHover={(hoverD) => {
          setHoveredCountry(hoverD);
        }}
        onPolygonClick={handleCountryClick}
        ambientLightColor={null} // Entfernen des Standard-Ambient-Lights
      />
      <Clouds />
      <Moon scene={globeEl.current?.scene()} />
      <Sun scene={globeEl.current?.scene()} />
      <style>
        {`
          .globe-label {          
            font-size: .8rem;
            color: #fff;
            background: rgba(65, 65, 65, 0.545);
            
            padding: 0.5rem;
            border-radius: 0.5rem;
            b{
              font-size: 1rem;
              color: #ff6e6e;
            }
            i{
              font-size: 0.7rem;
              font-family: monospace;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PolygonGlobe;
