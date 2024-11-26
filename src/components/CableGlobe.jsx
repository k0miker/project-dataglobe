import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";

function CableGlobe() {
  const { selectedWorld, rotationSpeed } = useAppContext();
  const globeEl = useRef();
  const [cablePaths, setCablePaths] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCableData = async () => {
    try {
      console.log("Fetching cable data...");
      setLoading(true);
      const response = await fetch("/cables.json");
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      const cablesGeo = await response.json();

      const paths = cablesGeo.features.flatMap(({ geometry, properties }) => {
        const { type, coordinates } = geometry;

        if (type === "MultiLineString") {
          return coordinates.map((lineCoords) => ({
            coords: lineCoords.map(([lng, lat]) => ({
              lat,
              lng,
            })),
            properties,
          }));
        } else if (type === "LineString") {
          return [
            {
              coords: coordinates.map(([lng, lat]) => ({
                lat,
                lng,
              })),
              properties,
            },
          ];
        } else {
          return [];
        }
      });

      setCablePaths(paths);
      setLoading(false);
      console.log("Cable data fetched successfully.");
    } catch (error) {
      console.error("Error fetching cable data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCableData();
  }, []);

  useEffect(() => {
    console.log("Setting rotation speed:", rotationSpeed);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="w-full h-full absolute overflow-hidden">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        pathsData={cablePaths}
        pathPoints="coords"
        pathPointLat={(p) => p.lat}
        pathPointLng={(p) => p.lng}
        pathColor={(path) => getRandomColor()}
        pathLabel={(path) => path.properties.name}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathDashAnimateTime={12000}
      />
    </div>
  );
}

export default CableGlobe;
