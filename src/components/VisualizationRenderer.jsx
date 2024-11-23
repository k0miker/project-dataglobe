import React from "react";
import { useAppContext } from "../context/AppContext";
import PolygonGlobe from "./PolygonGlobe";
import HeatmapGlobe from "./HeatmapGlobe";

function VisualizationRenderer() {
  const { visualizationType } = useAppContext();

  switch (visualizationType) {
    case "polygon":
      return <PolygonGlobe />;
    case "heatmap":
      return <HeatmapGlobe />;
    default:
      return null;
  }
}

export default VisualizationRenderer;