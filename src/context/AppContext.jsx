import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.jpg");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataOption, setDataOption] = useState("gdp");

  return (
    <AppContext.Provider
      value={{
        selectedWorld,
        setSelectedWorld,
        selectedCountry,
        setSelectedCountry,
        dataOption,
        setDataOption,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
