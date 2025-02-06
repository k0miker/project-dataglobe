import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="intro-video absolute left-0 top-0 w-screen h-screen object-cover">
      <video src="/intro.mp4" autoPlay muted className="opacity-40 w-screen h-auto" />
      <div className="intro-text font-mono">Dataglobe</div>
    </div>
  );
};

export default LoadingSpinner;
