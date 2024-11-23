import React from "react";
import Input from "../components/Input";
import Output from "../components/Output";
import VisualizationRenderer from "../components/VisualizationRenderer";
import Header from "../components/Header";

function HomePage() {
  return (
    <div className="relative flex w-full h-screen">
      <Header />
      <Input />
      <div className="flex-1 flex flex-col items-center justify-center">
        <VisualizationRenderer />
      </div>
      <Output />
    </div>
  );
}

export default HomePage;
