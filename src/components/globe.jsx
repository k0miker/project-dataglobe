import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";
import earthMarble from "../assets/images/earth-blue-marble.jpg";


const GlobeComponent = () => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = -0.5;
    }
  }, []);

  return (
    <div className="w-full h-full absolute ">
      <Globe
        ref={globeEl}
        globeImageUrl={earthMarble}
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  );
};

export default GlobeComponent;
