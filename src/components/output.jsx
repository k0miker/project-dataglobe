import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Output({ selectedCountry }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all"
        );
        setData(response.data);

        
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Lädt...</p>;
  }

  const filteredData = selectedCountry ? data.filter(item => item.name.common === selectedCountry) : [];

  return (
    <div className="w-1/5 absolute right-0 top-[10%] bottom-[10%] flex flex-col justify-center items-center bg-glass rounded-l-3xl ">
      <h1 className="text-2xl m-2">Länderinfo</h1>
      <ul className="p-5">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <React.Fragment key={item.cca3}>
              <li>
                <img src={item.flags.png} alt={`Flagge von ${item.name.common}`} width="50" />{item.name.common}
              </li>
              <li>Hauptstadt: {item.capital}</li>
              <li>Einwohner: {(item.population/1000000).toFixed(2)}Mio</li>
              <li>Fläche: {item.area} km²</li>
              <li>Region: {item.region}</li>
              <li>Sprache: {Object.values(item.languages).join(", ")}</li>
              <li>Unabhängig: {item.independent ? "Ja" : "Nein"}</li>
            </React.Fragment>
          ))
        ) : (
          <li>Bitte wählen Sie ein Land aus.</li>
        )}
      </ul>
    </div>
  );
}

export default Output;
