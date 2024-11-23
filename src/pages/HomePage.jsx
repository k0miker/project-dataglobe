import React from "react";
import Input from "../components/input";
import Output from "../components/output";
import VisualizationRenderer from "../components/VisualizationRenderer";

function HomePage() {
  return (
    <div className="relative flex w-full h-screen">
      <Input />
      <div className="flex-1 flex flex-col items-center justify-center">
        <VisualizationRenderer />
      </div>
      <Output />
    </div>
  );
}

export default HomePage;
