import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import PolygonGlobe from "./PolygonGlobe";
import HeatmapGlobe from "./HeatmapGlobe";
import CableGlobe from "./CableGlobe";
import Clouds from "./Clouds";

function VisualizationRenderer() {
  const { visualizationType } = useAppContext();
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  useEffect(() => {
    const checkGlobeElement = () => {
      const globeElement = document.getElementById("globeViz");
      if (globeElement) {
        setIsGlobeReady(true);
      } else {
        setTimeout(checkGlobeElement, 100); // Check again after 100ms
      }
    };
    checkGlobeElement();
  }, []);

  return (
    <>
      {visualizationType === "polygon" && <PolygonGlobe />}
      {visualizationType === "heatmap" && <HeatmapGlobe />}
      {(visualizationType === "cable" || visualizationType === "CableGlobe") && <CableGlobe />}
      {isGlobeReady && <Clouds />}
    </>
  );
}

export default VisualizationRenderer;