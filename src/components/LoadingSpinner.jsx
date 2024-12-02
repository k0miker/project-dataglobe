import React from "react";

const LoadingSpinner = () => {
  return (
    <div style={styles.introVideo}>
      <video src="/intro.mp4" autoPlay muted style={styles.video} />
      <div style={styles.introText}>Dataglobe</div>
    </div>
  );
};

const styles = {
  introVideo: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    transition: "opacity 1s ease-in",
    overflow: "hidden",
  },
  video: {
    width: "100vw",
    height: "100vh",
    opacity: 0.4,
    objectFit: "cover",
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
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
  },
};

export default LoadingSpinner;
