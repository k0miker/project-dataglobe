import React from "react";
import Input from "../components/Input";
import Output from "../components/Output";
import VisualizationRenderer from "../components/VisualizationRenderer";
import Header from "../components/Header";
import CableGlobe from "../components/CableGlobe";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="relative overflow-hidden flex w-full h-screen">
      <Header />
      <Input />
      <div id="globeViz" className="flex-1 flex flex-col items-center justify-center">
        <VisualizationRenderer />
      </div>
      <Output />
      <Footer />
    </div>
  );
}

export default HomePage;
