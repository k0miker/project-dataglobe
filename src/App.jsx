import React from "react";
import { AppProvider } from "./context/AppContext";
import './App.css';
import './index.css';
import HomePage from "./pages/HomePage";

function App() {
  return (
    <AppProvider>
      <HomePage className='flex justify-between w-screen h-screen ' />    
    </AppProvider>
  );
}

export default App;
