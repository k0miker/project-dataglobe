import { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import cloudsTexture from "../assets/images/clouds_transparent.png";
import * as THREE from "three";
import * as d3 from "d3";

const GlobeComponent = ({ selectedWorld }) => {
  const globeEl = useRef();
  const [countriesData, setCountriesData] = useState([]);
  const [colorScale, setColorScale] = useState(() =>
    d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
  );

  useEffect(() => {
    // Lade GeoJSON-Daten
    fetch("/ne_110m_admin_0_countries.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok: " + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log("GeoJSON Data fetched:", data);

        // Filtere Antarktis aus und speichere die Daten
        const filteredData = data.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        );
        setCountriesData(filteredData);

        // Erstelle Farbskala basierend auf GDP pro Kopf
        const getVal = (feat) =>
          feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
        const maxVal = Math.max(...filteredData.map(getVal));
        setColorScale((prevScale) => prevScale.domain([0, maxVal]));
      })
      .catch((error) => {
        console.error("Error fetching or processing data:", error);
      });
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
          const getVal = (feat) =>
            feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
          return colorScale(getVal(feat));
        }}
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
          Population: <i>${d.POP_EST}</i>
        `}
      />
    </div>
  );
};

export default GlobeComponent;
