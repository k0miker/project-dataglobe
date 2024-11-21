import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function output() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://cors-anywhere.herokuapp.com/https://ghoapi.azureedge.net/api/GHO"
//         );

//         setData(response.data.value); // Die Daten befinden sich im `value`-Array
//         setLoading(false);
//       } catch (error) {
//         console.error("Fehler beim Abrufen der Daten:", error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <p>Lädt...</p>;
//   }

  return (
    <div className="w-1/5 absolute right-0 top-[10%] bottom-[10%] flex justify-center items-center bg-glass rounded-l-3xl ">
      {/* <h1>Todesdaten Dashboard</h1>
      <ul>
        {data.map((item) => (
          <li key={item.IndicatorCode}>
            {item.IndicatorName} - {item.Country}: {item.Value}
          </li>
        ))} */}
      hallo
    </div>
  );
}

export default output;
