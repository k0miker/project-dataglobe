import { useAppContext } from '../context/AppContext';

const polygonLabel = ({ properties: d }, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData, ) => {
    let label = `<div class="globe-label"><b>${d.ADMIN} (${d.ISO_A2}):</b> <br /> <br />`;
    if (dataOption === "gdp") {
      label += `Bevölkerung: <br /><i>${(d.POP_EST / 1e6).toFixed(2)} Mio</i><br/>`;
      label += `GDP: <br /><i>${(d.GDP_MD_EST / 1e3).toFixed(2)} Mrd. $</i><br>`;
      label += `Economy: <br /> <i>${d.ECONOMY}</i><br>`;
      label += `<i>${d.INCOME_GRP}</i>`;
    } else if (dataOption === "density") {
      const country = restCountriesData.find(
        (country) => country.cca3 === d.ISO_A3
      );
      if (country) {
        label += `Bevölkerung: <br /><i>${(country.population / 1e6).toFixed(2)} Mio</i><br/>`;
        label += `Bevölkerungsdichte: <br /><i>${(country.population / country.area).toFixed(2)} Pers./km²</i>`;
      } else {
        label += `Bevölkerungsdichte: <br /><i>Keine Daten</i>`;
      }
    } else if (dataOption === "mortality") {
      const country = mortalityData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Sterblichkeitsrate: <br /><i>${country.value}%</i>`;
      } else {
        label += `Sterblichkeitsrate: <br /><i>Keine Daten</i>`;
      }
    } else if (dataOption === "debt") {
      const country = debtData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Schulden (% des BIP): <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Schulden (% des BIP): <br /><i>Keine Daten</i>`;
      }
    } else if (dataOption === "inflation") {
      const country = inflationData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Inflation seit 2010: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Inflation seit 2010: <br /><i>Keine Daten</i>`;
      }
    } else if (dataOption === "employment") {
      const country = employmentData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Beschäftigungsrate: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Beschäftigungsrate: <br /><i>Keine Daten</i>`;
      }
    } else if (dataOption === "health") {
      const country = healthData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Gesundheitsausgaben (% des BIP): <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Gesundheitsausgaben (% des BIP): <br /><i>Keine Daten</i>`;
      }
    } else if (dataOption === "growth") {
      const country = growthData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Wirtschaftswachstum: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Wirtschaftswachstum: <br /><i>Keine Daten</i>`;
      }
    }
    label += `</div>`;
    return label;
};

export default polygonLabel;