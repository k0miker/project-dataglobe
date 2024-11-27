import React, { useEffect } from "react";
import * as THREE from "three";
import { useAppContext } from "../context/AppContext";
import background from "../assets/images/background.png";

function Clouds() {
  const { clouds, selectedWorld } = useAppContext();

  useEffect(() => {
    if (!clouds) return;

    const CLOUDS_IMG_URL = "/clouds_transparent.png";
    const CLOUDS_ALT = 0.01;
    const CLOUDS_ROTATION_SPEED = -0.006;

    const scene = document.querySelector("canvas").__threeObj.scene;

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      console.log("Clouds texture loaded:", cloudsTexture);
      const cloudsMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1 + CLOUDS_ALT, 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      scene.add(cloudsMesh);
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
