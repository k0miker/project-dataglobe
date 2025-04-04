import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Moon = ({ scene }) => {
  const moonRef = useRef();

  useEffect(() => {
    if (scene) {
      const textureLoader = new THREE.TextureLoader();
      const moonTexture = textureLoader.load("/moon.jpg");

      const moonGeometry = new THREE.SphereGeometry(100, 32, 32); // Größe des Mondes
      const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(5000, 50, 4000); // Position des Mondes
      scene.add(moon);

      moonRef.current = moon;
    }
  }, [scene]);

  useEffect(() => {
    const animate = () => {
      if (moonRef.current) {
        moonRef.current.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.0001); // Rotate around Y-axis
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return null;
};

export default Moon;