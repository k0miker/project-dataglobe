import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";
import { useAppContext } from "../context/AppContext";
import background from "../assets/images/background.png";

function CableGlobe() {
  const { selectedWorld, rotationSpeed } = useAppContext();
  const globeEl = useRef();
  const [cablePaths, setCablePaths] = useState([]);

  useEffect(() => {
    const fetchCableData = async () => {
      try {
        const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://www.submarinecablemap.com/api/v3/cable/cable-geo.json"));
        const data = await response.json();
        const cablesGeo = JSON.parse(data.contents);
        const paths = cablesGeo.features.map(({ geometry, properties }) => ({
          coords: geometry.coordinates.map(([lng, lat]) => ({ lat: parseFloat(lat), lng: parseFloat(lng) })),
          properties
        }));
        setCablePaths(paths);
      } catch (error) {
        console.error("Error fetching cable data:", error);
      }
    };

    fetchCableData();
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

  return (
    <div className="w-full h-full absolute overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        pathsData={cablePaths}
        pathPoints="coords"
        pathPointLat={p => p.lat}
        pathPointLng={p => p.lng}
        pathColor={() => 'rgba(255, 0, 0, 0.6)'}
        pathLabel={path => path.properties.name}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathDashAnimateTime={12000}
      />
    </div>
  );
}

export default CableGlobe;