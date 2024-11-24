import React, { useEffect } from "react";
import * as THREE from "three";
import { useAppContext } from "../context/AppContext";
import Globe from "globe.gl";

function Clouds() {
  const { clouds, selectedWorld } = useAppContext();

  useEffect(() => {
    if (!clouds) return;

    const globeElement = document.getElementById("globeViz");
    if (!globeElement) {
      console.error("globeViz element not found");
      return;
    }

    const world = Globe({ animateIn: false })(globeElement)
      .globeImageUrl(`/${selectedWorld}`)
    

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.35;

    const CLOUDS_IMG_URL = "/clouds_transparent.png";
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.006;

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      console.log("Clouds texture loaded:", cloudsTexture);
      const cloudsMesh = new THREE.Mesh(
        new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      world.scene().add(cloudsMesh);
      console.log("Clouds mesh added to scene:", cloudsMesh);

      (function rotateClouds() {
        cloudsMesh.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
      })();
    });
  }, [clouds, selectedWorld]);

  return null;
}

export default Clouds;
