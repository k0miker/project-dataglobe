import { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import * as d3 from "d3";
import * as THREE from "three";
import { useAppContext } from "../context/AppContext";
import { fetchCountries, fetchGeoJson } from "../utils/fetches";

function PolygonGlobe() {
  // Kontext und State-Variablen
  const {
    selectedWorld,
    dataOption,
    showData,
    rotationSpeed,
    selectedCountry,
    setSelectedCountry,
    geoJsonData,
  } = useAppContext();
  const globeEl = useRef();
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [colorScale, setColorScale] = useState(() =>
    d3.scaleSequentialSqrt(d3.interpolateReds)
  );
  const [restCountriesData, setRestCountriesData] = useState([]);

  // RestCountries Daten abrufen
  useEffect(() => {
    const getRestCountriesData = async () => {
      try {
        const data = await fetchCountries();
        setRestCountriesData(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Restcountries-Daten:", error);
      }
    };
    getRestCountriesData();
  }, []);

  // GeoJSON Daten verarbeiten
  useEffect(() => {
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

  //rotation stop wenn land ausgewählt
  useEffect(() => {
    if (selectedCountry) {
      globeEl.current.controls().autoRotate = false;
    }
  }, [selectedCountry]);

  // Funktion zum Animieren der Kamera auf das ausgewählte Land
  const animateCameraToCountry = (country) => {
    if (globeEl.current && country) {
      const { latlng } = country;
      const [lat, lng] = latlng;
      globeEl.current.pointOfView({ lat, lng, altitude: 2 }, 2500) // Dauer der Animation);
    }
  };

  // Überwache Änderungen am ausgewählten Land und animiere die Kamera
  useEffect(() => {
    animateCameraToCountry(selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="w-full h-full absolute overflow-hidden">
      <Globe
        ref={globeEl}
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
          color.opacity = alpha * 3; // Reduziere die Transparenz
          return feat === hoveredCountry
            ? color.formatRgb()
            : color.formatRgb();
        }}
        polygonSideColor={() => "rgba(0, 0, 0, 0.522)"}
        polygonStrokeColor={(feat) => {
          if (
            selectedWorld === "earthDark.png" ||
            selectedWorld === "earthWater.png"
          ) {
            return "rgba(255, 255, 255, .1)";
          }
          return feat === hoveredCountry ? "#FFFFFF" : "#000000";
        }}
        polygonLabel={({ properties: d,selectedCountry }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          GDP: <i>${d.GDP_MD_EST / 1000}M$</i><br/>
          Population: <i>${(d.POP_EST / 1000000).toFixed(2)} Mio</i>
        ` }
        onPolygonHover={(hoverD) => {
          setHoveredCountry(hoverD);
        }}
        onPolygonClick={(clickedCountry) => {
          const country = restCountriesData.find(
            (country) => country.cca3 === clickedCountry.properties.ISO_A3
          );
          if (country) {
            setSelectedCountry(country);
          }
        }}
        polygonsTransitionDuration={300}
        polygonAltitude={(d) => {
          if (d.properties.ISO_A3 === selectedCountry?.cca3) return 0.1;
          if (d === hoveredCountry) return 0.2;
          return 0.006;
        }}
      />
    </div>
  );
}

export default PolygonGlobe;