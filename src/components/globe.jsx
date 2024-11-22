import { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import background from "../assets/images/background.png";
import cloudsTexture from "../assets/images/clouds_transparent.png";
import * as THREE from "three";
import * as d3 from "d3";

const GlobeComponent = ({ selectedWorld }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const globeEl = useRef();
  selectedWorld !== "earthDark.jpg"
    ? console.log("globe:" + selectedWorld)
    : console.log("globe: earthDark.jpg");
  useEffect(
    () => {
      const onWindowResize = () => {
        globeEl.current.camera().aspect =
          window.innerWidth / window.innerHeight;
        globeEl.current.camera().updateProjectionMatrix();
        globeEl.current
          .renderer()
          .setSize(window.innerWidth, window.innerHeight);
      };
      setWindowWidth(window.innerWidth);

      window.addEventListener("resize", onWindowResize);

      if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = -0.3;
        globeEl.current.controls().enableDamping = true;
      }
    },
    [windowWidth],
    [selectedWorld]
  );

  useEffect(() => {
    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

    const getVal = (feat) =>
      feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

    fetch("/assets/data/ne_110m_admin_0_countries.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((countries) => {
        console.log("Data fetched successfully:", countries);
        const maxVal = Math.max(...countries.features.map(getVal));
        colorScale.domain([0, maxVal]);

        globeEl.current
          .polygonsData(
            countries.features.filter((d) => d.properties.ISO_A2 !== "AQ")
          )
          .polygonAltitude(0.06)
          .polygonCapColor((feat) => colorScale(getVal(feat)))
          .polygonSideColor(() => "rgba(0, 100, 0, 0.15)")
          .polygonStrokeColor(() => "#111")
          .polygonLabel(
            ({ properties: d }) => `
              <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
              GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
              Population: <i>${d.POP_EST}</i>
            `
          )
          .onPolygonHover((hoverD) =>
            globeEl.current
              .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
              .polygonCapColor((d) =>
                d === hoverD ? "steelblue" : colorScale(getVal(d))
              )
          )
          .polygonsTransitionDuration(300);
      })
      .catch((error) => {
        console.error("Error fetching or processing data:", error);
      });
  }, [selectedWorld]);

  //clouds

  // useEffect(() => {
  //   if (globeEl.current) {
  //     // Wolken
  //     const CLOUDS_ALT = 0.008;
  //     const CLOUDS_ROTATION_SPEED = -0.005;

  //     new THREE.TextureLoader().load(cloudsTexture, cloudsTexture => {
  //       const clouds = new THREE.Mesh(
  //         new THREE.SphereGeometry(globeEl.current.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
  //         new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
  //       );
  //       globeEl.current.scene().add(clouds);
  //       (function rotateClouds() {
  //         clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
  //         requestAnimationFrame(rotateClouds);
  //       })();
  //     });
  //   }
  // }, [ selectedWorld]);

  return (
    <div className="w-full h-full absolute overflow-hidden">
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
