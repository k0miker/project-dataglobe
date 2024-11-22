import { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import * as d3 from "d3";
import axios from "axios";

const GlobeComponent = ({ selectedWorld, dataOption }) => {
  const globeEl = useRef();
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [colorScale, setColorScale] = useState(() =>
    d3.scaleSequentialSqrt(d3.interpolateBlues)
  );
  const [restCountriesData, setRestCountriesData] = useState([]);

  useEffect(() => {
    const fetchRestCountriesData = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setRestCountriesData(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Restcountries-Daten:", error);
      }
    };
    fetchRestCountriesData();
  }, []);

  useEffect(() => {
    fetch("/ne_110m_admin_0_countries.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok: " + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        const filteredData = data.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        );
        setCountriesData(filteredData);

        const getVal = (feat) => {
          if (dataOption === "gdp") {
            return feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
          } else if (dataOption === "density") {
            const country = restCountriesData.find(country => country.cca3 === feat.properties.ISO_A3);
            if (country) {
              return country.population / Math.max(1, country.area);
            }
          }
          return 0;
        };

        const maxVal = Math.max(...filteredData.map(getVal));
        setColorScale((prevScale) => prevScale.domain([0, maxVal]));
      })
      .catch((error) => {
        console.error("Error fetching or processing data:", error);
      });
  }, [dataOption, restCountriesData]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.2;
    }
  }, []);

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
          const getVal = (feat) => {
            if (dataOption === "gdp") {
              return (feat.properties.GDP_MD_EST) / Math.max(1e5, feat.properties.POP_EST);
            } else if (dataOption === "density") {
              const country = restCountriesData.find(country => country.cca3 === feat.properties.ISO_A3);
              if (country) {
                return country.population / Math.max(1, country.area);
              }
            }
            return 0;
          };
          const color = d3.color(colorScale(getVal(feat)));
          const alpha = getVal(feat) / colorScale.domain()[1];
          color.opacity = alpha * 3; // Reduziere die Transparenz
          return feat === hoveredCountry ? "steelblue" : color.formatRgb();
        }}
        polygonSideColor={() => "rgba(0, 0, 0, 0.522)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          GDP: <i>${d.GDP_MD_EST/1000}M$</i><br/>
          Population: <i>${(d.POP_EST/1000000).toFixed(2)} Mio</i>
        `}
        polygonAltitude={(feat) => (feat === hoveredCountry ? 0.12 : 0.06)}
        onPolygonHover={(hoverD) => {
          setHoveredCountry(hoverD);
        }}
        polygonsTransitionDuration={300}
        polygonAltitude={(d) => (d === hoveredCountry ? 0.1 : 0.006)}
      />
    </div>
  );
};

export default GlobeComponent;
