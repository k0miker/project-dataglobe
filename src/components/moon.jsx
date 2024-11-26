import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Moon = ({ scene }) => {
  const moonRef = useRef();

  useEffect(() => {
    if (scene) {
      const textureLoader = new THREE.TextureLoader();
      const moonTexture = textureLoader.load("/moon.jpg");

      const moonGeometry = new THREE.SphereGeometry(100, 32, 32); // Noch größere Mond
      const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(5000, 0, 4000); // Weiter weg positionieren
      scene.add(moon);

      const light = new THREE.DirectionalLight(0xffffff, 5, 0, 1);
      light.position.set(-30000, 0, -1000);
      scene.add(light);

      // Add ambient light to ensure the globe is lit
  

      moonRef.current = moon;
    }
  }, [scene]);

  useEffect(() => {
    const animate = () => {
      if (moonRef.current) {
        moonRef.current.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0005); // Rotate around Y-axis
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return null;
};

export default Moon;