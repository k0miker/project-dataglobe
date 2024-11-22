import React from "react";
import Input from "../components/input";
import GlobeComponent from "../components/globe";
import Output from "../components/output";

function HomePage() {
  return (
    <div className="relative flex w-full h-screen">
      <Input />
      <div className="flex-1 flex items-center justify-center">
        <GlobeComponent />
      </div>
      <Output />
    </div>
  );
}

export default HomePage;
