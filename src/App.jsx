import React from "react";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}

export default App;
