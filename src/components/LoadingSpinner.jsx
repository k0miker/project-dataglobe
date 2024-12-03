import React from "react";

const LoadingSpinner = () => {
  return (
    <div style={styles.spinnerVideo}>
      <video src="/intro.mp4" autoPlay muted style={styles.video} />
      <div style={styles.introText}>Dataglobe</div>
    </div>
  );
};

const styles = {
  spinnerVideo: {
    position: "relative",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 1s ease-in",
    overflow: "hidden",
  },
  video: {

    position: "relative",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "80vh",
    opacity: 0.4,
    objectFit: "contain",
  },
  introText: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    fontSize: "10vw",
    letterSpacing: "-0.9vw",
    fontWeight: 900,
    color: "rgba(103, 103, 103, 0.662)",
    fontFamily: "'Arial', sans-serif",
    // backgroundClip: "text",
    // WebkitBackgroundClip: "text",    
    pointerEvents: "none", 
    userSelect: "none", 
  },
};

export default LoadingSpinner;
