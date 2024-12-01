import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import PolygonGlobe from "./PolygonGlobe";
import HeatmapGlobe from "./HeatmapGlobe";
import CableGlobe from "./CableGlobe";

function VisualizationRenderer() {
  const { visualizationType, dataOption } = useAppContext();

  return (
    <>
      {visualizationType === "polygon" && <PolygonGlobe />}
      {visualizationType === "heatmap" && <HeatmapGlobe />}
      {dataOption === "cable" && <CableGlobe />} {/* CableGlobe nur anzeigen, wenn der Datentyp 'cable' ist */}
    </>
  );
}

export default VisualizationRenderer;