import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";

function App() {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.jgp");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataOption, setDataOption] = useState("gdp");
  const [showData, setShowData] = useState(true);

  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}

export default App;
