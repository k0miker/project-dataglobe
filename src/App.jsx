import React, { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import './App.css';
import './index.css';
import HomePage from "./pages/HomePage";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowIntro(false);
      }, 1000); // Zeit für die Ausblendung
    }, 2000); // Video-Intro für 2 Sekunden anzeigen
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      {showIntro ? (
        <div className={`intro-video ${fadeOut ? 'fade-out' : ''}`}>
          <video src="/intro.mp4" autoPlay muted />
          <div className="intro-text font-mono">Dataglobe</div>
        </div>
      ) : (
        <HomePage className='flex justify-between w-screen h-screen ' />
      )}
    </AppProvider>
  );
}

export default App;
