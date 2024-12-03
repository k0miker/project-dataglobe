import React, { useEffect } from "react";
import * as THREE from "three";
import { useAppContext } from "../context/AppContext";
import cloudsTexture from "/clouds_transparent.png";

function Clouds({ globeEl }) {
  const { clouds } = useAppContext();

  useEffect(() => {
    if (!clouds || !globeEl.current) return;

    const CLOUDS_ALT = 0.005;
    const CLOUDS_ROTATION_SPEED = -0.005;

    new THREE.TextureLoader().load(cloudsTexture, cloudsTexture => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(
          globeEl.current.getGlobeRadius() * (1 + CLOUDS_ALT),
          75,
          75
        ),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      globeEl.current.scene().add(clouds);
      (function rotateClouds() {
        clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
        requestAnimationFrame(rotateClouds);
      })();
    });
  }, [clouds, globeEl]);

  return null;
}

export default Clouds;
