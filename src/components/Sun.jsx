import React, { useEffect } from "react";
import * as THREE from "three";

const Sun = ({ scene }) => {
  useEffect(() => {
    if (scene) {
      const textureLoader = new THREE.TextureLoader();
      const sunTexture = textureLoader.load("/sun.jpg");

      const sunGeometry = new THREE.SphereGeometry(350, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, emissive: 0xffffff, emissiveIntensity: 1 });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(-40800, 0, 100);
      scene.add(sun);

      const sunlight = new THREE.DirectionalLight(0xffffff, 5);
      sunlight.position.set(-36000, 0, -1000);
      scene.add(sunlight);
    }
  }, [scene]);

  return null;
};

export default Sun;
