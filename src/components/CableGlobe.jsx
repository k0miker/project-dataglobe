import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
import Moon from "./Moon";
import Sun from "./Sun";

function CableGlobe() {
  const { selectedWorld, rotationSpeed, showData, showBorders, showGrid, cableColorSet } = useAppContext();
  const globeEl = useRef();
  const [cablePaths, setCablePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

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
        setTimeout(() => {
          setFadeOut(true);
          setLoading(false);
        }, 1000); // Zeit für die Ausblendung
      }, 2000); // Video-Intro für 2 Sekunden anzeigen
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

  const getColorFromSet = (set) => {
    switch (set) {     
      case "monochrome":
        return ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF"];
      case "blues":
        return ["#0000d8", "#0101b9", "#000092", "#000066", "#000033"];
      case "reds":
        return ["#dc0000", "#b40000", "#870000", "#530000", "#390000"];
      case "greens":
        return ["#00FF00", "#00CC00", "#009900", "#006600", "#003300"];
      default:
        return ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF"];
       
    }
  };

  const getRandomColorFromSet = (set) => {
    const colors = getColorFromSet(set);
    return colors[Math.floor(Math.random() * colors.length)];
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
        <LoadingSpinner />
      )}
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        pathsData={showData ? cablePaths : []}
        pathPoints="coords"
        pathPointLat={(p) => p.lat}
        pathPointLng={(p) => p.lng}
        pathColor={() => getRandomColorFromSet(cableColorSet)} 
        pathLabel={(path) => path.properties.name}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathDashAnimateTime={12000}
        onPathClick={handleCableClick}
        polygonsData={showBorders ? cablePaths : []}
        polygonCapColor={() => showData ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
        polygonSideColor={() => showBorders ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
        polygonStrokeColor={() => showBorders ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
        ambientLightColor={null} 
        showGraticules={showGrid}
      />
      <Moon scene={globeEl.current?.scene()} />
      <Sun scene={globeEl.current?.scene()} />
    </div>
  );
}

export default CableGlobe;
