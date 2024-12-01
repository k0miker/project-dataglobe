import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
import Moon from "./Moon";
import Sun from "./Sun";

function CableGlobe() {
  const { selectedWorld, rotationSpeed, showData, showBorders, showGrid } = useAppContext();
  const globeEl = useRef();
  const [cablePaths, setCablePaths] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCableData = async () => {
    try {
      //console.log("Fetching cable data...");
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
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Ladezustand um eine Sekunde verzögern
      //console.log("Cable data fetched successfully.");
    } catch (error) {
      //console.error("Error fetching cable data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCableData();
  }, []);

  useEffect(() => {
    //console.log("Setting rotation speed:", rotationSpeed);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = rotationSpeed;
    }
  }, [rotationSpeed]);

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

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const animateCameraToCable = (cable) => {
    if (globeEl.current && cable) {
      const { coords } = cable;
      const [firstCoord] = coords;
      const { lat, lng } = firstCoord;
      const altitude = 1;
      globeEl.current.pointOfView({ lat, lng, altitude }, 1500); // Zoom auf das Kabel
    }
  };

  const handleCableClick = (cable, event) => {
    event.stopPropagation(); // Prevent deselecting when clicking on a cable
    animateCameraToCable(cable); // Animate camera to the clicked cable
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
        pathsData={showData ? cablePaths : []}
        pathPoints="coords"
        pathPointLat={(p) => p.lat}
        pathPointLng={(p) => p.lng}
        pathColor={(path) => getRandomColor()}
        pathLabel={(path) => path.properties.name}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathDashAnimateTime={12000}
        onPathClick={handleCableClick}
        polygonsData={showBorders ? cablePaths : []}
        polygonCapColor={() => showData ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
        polygonSideColor={() => showBorders ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
        polygonStrokeColor={() => showBorders ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
        ambientLightColor={null} // Entfernen des Standard-Ambient-Lights
        showGraticules={showGrid} // Grid anzeigen oder ausblenden
      />
      <Moon scene={globeEl.current?.scene()} />
      <Sun scene={globeEl.current?.scene()} />
    </div>
  );
}

export default CableGlobe;
