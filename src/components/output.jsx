import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Output({ selectedCountry }) {
  const [data, setData] = useState([]);
  const [gdp, setGdp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchGdp = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.get(
            `https://api.worldbank.org/v2/country/${selectedCountry.cca3}/indicator/NY.GDP.MKTP.CD?format=json`
          );
          setGdp(response.data[1][0].value);
          console.log(response);
          
        } catch (error) {
          console.error("Fehler beim Abrufen des BIP:", error);
        }
      }
    };
    fetchGdp();
  }, [selectedCountry]);

  if (loading) {
    return <p>Lädt...</p>;
  }

  const filteredData = selectedCountry
    ? data.filter((item) => item.cca3 === selectedCountry.cca3)
    : [];

  return (
    <div className="w-1/5 absolute right-0 top-[10%] bottom-[10%] flex flex-col justify-center items-center bg-glass rounded-l-3xl ">
      <h1 className="text-2xl m-2">Länderinfo</h1>
      <ul className="p-5">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <React.Fragment key={item.cca3}>
              <li className="flex justify-around">
              <img
                  src={item.flags.png}
                  alt={`Flagge von ${item.name.common}`}                  
                  className="w-full rounded-lg border-2 border-gray-200"
                />
              </li>
              <li className="flex justify-center text-2xl underline p-2 text-center">               
                {item.name.common}
              </li>
              <li>
                Hauptstadt: <span>{item.capital}</span>{" "}
              </li>
              <li>
                Einwohner: <span>{(item.population / 1000000).toFixed(2)} Mio</span>
              </li>
              <li>
                Fläche: <span>{item.area} km²</span>
              </li>
              <li className="flex">Dichte: <br /> <span> {(item.population/item.area).toFixed(2)}Pers/km² </span></li>
              <li>
                Region: <span>{item.region}</span>
              </li>
              <li>
                Sprache: <span>{Object.values(item.languages).join(", ")}</span>
              </li>
              <li>
                Unabhängig: <span>{item.independent ? "Ja" : "Nein"}</span>
              </li>
              <li className="flex ">
                Währung:{" "}
                {Object.values(item.currencies).map(
                  (currency, index, array) => (
                    <span key={currency.name}><div>{currency.symbol}
                      {index < array.length - 1 ? ", " : ""}</div>
                    </span>
                  )
                )}
              </li>
              <li>
                BIP: <span>{gdp ? `$${(gdp / 1000000000).toFixed(2)} Mrd` : "Keine Daten verfügbar"}</span>
              </li>
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
