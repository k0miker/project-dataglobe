import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import background from "../assets/images/background.png"; // Hintergrundbild
import { useAppContext } from "../context/AppContext";
import { fetchCountries } from "../utils/fetches";
import Moon from "./moon";
import LoadingSpinner from "./LoadingSpinner";

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
    colorScheme
  } = useAppContext();

  const globeEl = useRef(); // Referenz für den Globe
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [colorScale, setColorScale] = useState(() =>
    d3[`scaleSequentialSqrt`](d3[`interpolate${colorScheme}`]).domain([0, 1])
  );
  const [restCountriesData, setRestCountriesData] = useState([]);
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

  // RestCountries Daten abrufen
  useEffect(() => {
    const getRestCountriesData = async () => {
      try {
        console.log("Fetching RestCountries data...");
        setLoading(true);
        const data = await fetchCountries();
        setRestCountriesData(data);
        setLoading(false);
        console.log("RestCountries data fetched successfully.");
      } catch (error) {
        console.error("Fehler beim Abrufen der RestCountries-Daten:", error);
        setLoading(false);
      }
    };
    getRestCountriesData();
  }, []);

  // GeoJSON Daten verarbeiten
  const processGeoJsonData = () => {
    console.log("Processing GeoJSON data...");
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
    setColorScale(() => d3[`scaleSequentialSqrt`](d3[`interpolate${colorScheme}`]).domain([0, maxVal * 0.8])); // Intensivere Farben
    setCountriesData(geoJsonData);
    console.log("GeoJSON data processed successfully.");
  };

  useEffect(() => {
    processGeoJsonData();
  }, [dataOption, restCountriesData, geoJsonData, colorScheme]);

  // Rotationsgeschwindigkeit einstellen
  useEffect(() => {
    console.log("Setting rotation speed:", rotationSpeed);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  // Rotation stoppen, wenn ein Land ausgewählt ist
  useEffect(() => {
    console.log("Selected country changed:", selectedCountry);
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
      globeEl.current.pointOfView({ lat, lng, altitude }, 1500); // Zoom auf das Land
    }
  };

  // Reaktion auf Änderungen des ausgewählten Landes
  useEffect(() => {
    console.log("Animating camera to country:", selectedCountry);
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
    console.log("Setting color scale for color scheme:", colorScheme);
    setColorScale(() => d3[`scaleSequentialSqrt`](d3[`interpolate${colorScheme}`]).domain([0, 1]));
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

  useEffect(() => {
    const controls = globeEl.current.controls();
    const handleUserInteraction = () => {
      controls.autoRotate = false;
    };

    controls.addEventListener("start", handleUserInteraction);
    return () => {
      controls.removeEventListener("start", handleUserInteraction);
    };
  }, []);

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
          if (!showData && feat !== hoveredCountry && feat !== selectedCountry) return "rgba(0, 0, 0, 0)";
          if (!showData && (feat === hoveredCountry || feat === selectedCountry)) return d3[`interpolate${colorScheme}`](1);
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
          return feat === hoveredCountry || feat === selectedCountry
            ? color.formatRgb()
            : color.formatRgb();
        }}
        polygonSideColor={() => {
          if (showData || showBorders) return "rgba(0, 0, 0, 0.522)";
          return "rgba(0, 0, 0, 0.002)";
        }}
        polygonStrokeColor={(feat) => {
          if (!showBorders || (!showData && feat !== hoveredCountry && feat !== selectedCountry)) return "rgba(0, 0, 0, 0)";
          return feat === hoveredCountry ||
            feat.properties.ISO_A3 === selectedCountry?.cca3
            ? "#FFFFFF"
            : "#000000";
        }}
        polygonsTransitionDuration={400}
        polygonAltitude={(d) => {
          if (d.properties.ISO_A3 === selectedCountry?.cca3) return 0.1; // Heben des ausgewählten Landes
          if (d === hoveredCountry && showData) return 0.1; // Heben des gehovteten Landes
          return showData ? 0.01 :0.01; // Keine Höhe, wenn showData aus ist
        }}
        polygonLabel={({ properties: d }) => `
          <div class="globe-label">
            <b>${d.ADMIN} (${d.ISO_A2}):</b> <br /> <br />
            Bevölkerung:  <br /><i>${(d.POP_EST / 1e6).toFixed(2)} Mio</i><br/>
            GDP:  <br /><i>${(d.GDP_MD_EST / 1e3).toFixed(2)} Mrd. $</i><br>
            Economy: <br /> <i>${d.ECONOMY}</i>
           <br> <i>${d.INCOME_GRP}</i>
          </div>
        `} // Keine Labels, wenn showData aus ist
        onPolygonHover={(hoverD) => {
          setHoveredCountry(hoverD);
        }}
        onPolygonClick={(clickedCountry, event) => {
          event.stopPropagation(); // Prevent deselecting when clicking on a country
          const country = restCountriesData.find(
            (country) => country.cca3 === clickedCountry.properties.ISO_A3
          );
          if (country) {
            setSelectedCountry((prevCountry) =>
              prevCountry?.cca3 === country.cca3 ? null : country
            ); // Deselect if clicking on the same country again
          }
        }}
      />
      <Moon scene={globeEl.current?.scene()} />
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
