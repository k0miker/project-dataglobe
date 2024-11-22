import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

import background from "../assets/images/background.png";
import cloudsTexture from "../assets/images/clouds_transparent.png";
import * as THREE from "three";

const GlobeComponent = ({ selectedWorld }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const globeEl = useRef();

  useEffect(
    () => {
      const onWindowResize = () => {
        globeEl.current.camera().aspect =
          window.innerWidth / window.innerHeight;
        globeEl.current
          .camera()
         .updateProjectionMatrix();
        globeEl.current
          .renderer()
          .setSize(window.innerWidth, window.innerHeight);
      };
      setWindowWidth(window.innerWidth);
      

      window.addEventListener("resize", onWindowResize);

      if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = -0.3;
      }
    },
    [windowWidth],
    [selectedWorld]
  );
  // console.log("globe:" + globeEl);
  console.log("globe:" + selectedWorld);
  useEffect(() => {
    if (globeEl) {
      globeEl.current.globeImageUrl = selectedWorld;
    }
  }, [selectedWorld]);

  //clouds
  //   useEffect(() => {
  //     if (globeEl.current) {
  //       // Wolken
  //       const CLOUDS_ALT = 0.008;
  //       const CLOUDS_ROTATION_SPEED = -0.005;

  //       new THREE.TextureLoader().load(cloudsTexture, cloudsTexture => {
  //         const clouds = new THREE.Mesh(
  //           new THREE.SphereGeometry(globeEl.current.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
  //           new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
  //         );
  //         globeEl.current.scene().add(clouds);
  //         (function rotateClouds() {
  //           clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
  //           requestAnimationFrame(rotateClouds);
  //         })();
  //       });
  //     }
  //   }, []);

  return (
    <div className="w-full h-full absolute">
      <Globe
        ref={globeEl}
        globeImageUrl={selectedWorld}
        backgroundImageUrl={background}
        showGraticules={true}
        atmosphereAltitude={0.2}
        atmosphereColor={"#fff"}
      />
    </div>
  );
};

export default GlobeComponent;
