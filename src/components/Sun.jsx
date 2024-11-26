import React, { useEffect } from "react";
import * as THREE from "three";

const Sun = ({ scene }) => {
  useEffect(() => {
    if (scene) {
      const sunGeometry = new THREE.SphereGeometry(250, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(-35500, 0, 100);
      scene.add(sun);

      const sunlight = new THREE.DirectionalLight(0xffffff, 5);
      sunlight.position.set(-30000, 0, -1000);
      scene.add(sunlight);

      // Atmosphäre hinzufügen
      const atmosphereGeometry = new THREE.SphereGeometry(260, 32, 32);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(1.0, 0.6, 0.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.position.copy(sun.position);
      scene.add(atmosphere);
    }
  }, [scene]);

  return null;
};

export default Sun;
