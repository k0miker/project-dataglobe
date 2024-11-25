import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png"; // Hintergrundbild
import * as d3 from "d3";
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";

function PolygonGlobe() {
  const {
    selectedWorld,
    dataOption,
    showData,
    rotationSpeed,
    selectedCountry,
    setSelectedCountry,
    geoJsonData,
  } = useAppContext();

  const globeEl = useRef(); // Referenz für den Globe
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [colorScale, setColorScale] = useState(() =>
    d3.scaleSequentialSqrt(d3.interpolateReds)
  );
  const [restCountriesData, setRestCountriesData] = useState([]);

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
        const data = await fetchCountries();
        setRestCountriesData(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der RestCountries-Daten:", error);
      }
    };
    getRestCountriesData();
  }, []);

  // GeoJSON Daten verarbeiten
  useEffect(() => {
    const getVal = (feat) => {
      if (dataOption === "gdp") {
        return (
          feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST)
        );
      } else if (dataOption === "density") {
        const country = restCountriesData.find(
          (country) => country.cca3 === feat.properties.ISO_A3
        );
        if (country) {
          return country.population / Math.max(1, country.area);
        }
      }
      return 0;
    };

    const maxVal = Math.max(...geoJsonData.map(getVal));
    setColorScale((prevScale) => prevScale.domain([0, maxVal]));
    setCountriesData(geoJsonData);
  }, [dataOption, restCountriesData, geoJsonData]);

  // Rotationsgeschwindigkeit einstellen
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  // Rotation stoppen, wenn ein Land ausgewählt ist
  useEffect(() => {
    if (selectedCountry && globeEl.current) {
      globeEl.current.controls().autoRotate = false;
    }
  }, [selectedCountry]);

  // Kameraanimation zum ausgewählten Land
  const animateCameraToCountry = (country) => {
    if (globeEl.current && country) {
      const { latlng } = country; // Längen- und Breitengrad des Landes
      const [lat, lng] = latlng;
      globeEl.current.pointOfView({ lat, lng, altitude: 2 }, 2500); // Zoom auf das Land
    }
  };

  // Reaktion auf Änderungen des ausgewählten Landes
  useEffect(() => {
    animateCameraToCountry(selectedCountry);
  }, [selectedCountry]);

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
    >
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        showGraticules={true}
        atmosphereAltitude={0.2}
        atmosphereColor={"#fff"}
        polygonsData={countriesData}
        polygonCapColor={(feat) => {
          if (!showData) return "rgba(0, 0, 0, 0)";
          const getVal = (feat) => {
            if (dataOption === "gdp") {
              return (
                feat.properties.GDP_MD_EST /
                Math.max(1e5, feat.properties.POP_EST)
              );
            } else if (dataOption === "density") {
              const country = restCountriesData.find(
                (country) => country.cca3 === feat.properties.ISO_A3
              );
              if (country) {
                return country.population / Math.max(1, country.area);
              }
            }
            return 0;
          };
          const color = d3.color(colorScale(getVal(feat)));
          const alpha = getVal(feat) / colorScale.domain()[1];
          color.opacity = alpha * 3; // Transparenz anpassen
          return feat === hoveredCountry
            ? color.formatRgb()
            : color.formatRgb();
        }}
        polygonSideColor={() => "rgba(0, 0, 0, 0.522)"}
        polygonStrokeColor={(feat) => {
          return feat === hoveredCountry ? "#FFFFFF" : "#000000";
        }}
        polygonsTransitionDuration={300}
        polygonAltitude={(d) => {
          if (d.properties.ISO_A3 === selectedCountry?.cca3) return 0.1; // Heben des ausgewählten Landes
          if (d === hoveredCountry) return 0.2; // Heben des gehovteten Landes
          return 0.006;
        }}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          Bevölkerung: <i>${(d.POP_EST / 1e6).toFixed(2)} Mio</i><br/>
          GDP: <i>${(d.GDP_MD_EST / 1e3).toFixed(2)} Mrd. $</i>
        `}
        onPolygonHover={(hoverD) => {
          setHoveredCountry(hoverD);
        }}
        onPolygonClick={(clickedCountry) => {
          const country = restCountriesData.find(
            (country) => country.cca3 === clickedCountry.properties.ISO_A3
          );
          if (country) {
            setSelectedCountry(country); // Setze das ausgewählte Land
          }
        }}
      />
    </div>
  );
}

export default PolygonGlobe;
