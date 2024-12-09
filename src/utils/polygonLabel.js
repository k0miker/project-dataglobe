import { useAppContext } from '../context/AppContext';

const polygonLabel = ({ properties: d }, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData, ) => {
    let label = `<div class="globe-label"><b>${d.ADMIN} (${d.ISO_A2}):</b> <br /> <br />`;
    if (dataOption === "gdp") {
      label += `Population: <br /><i>${(d.POP_EST / 1e6).toFixed(2)} million</i><br/>`;
      label += `GDP: <br /><i>${(d.GDP_MD_EST / 1e3).toFixed(2)} billion $</i><br>`;
      label += `Economy: <br /> <i>${d.ECONOMY}</i><br>`;
      label += `<i>${d.INCOME_GRP}</i>`;
    } else if (dataOption === "density") {
      const country = restCountriesData.find(
        (country) => country.cca3 === d.ISO_A3
      );
      if (country) {
        label += `Population: <br /><i>${(country.population / 1e6).toFixed(2)} million</i><br/>`;
        label += `Population Density: <br /><i>${(country.population / country.area).toFixed(2)} people/km²</i>`;
      } else {
        label += `Population Density: <br /><i>No data</i>`;
      }
    } else if (dataOption === "mortality") {
      const country = mortalityData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Mortality Rate: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Mortality Rate: <br /><i>No data</i>`;
      }
    } else if (dataOption === "debt") {
      const country = debtData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Debt (% of GDP): <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Debt (% of GDP): <br /><i>No data</i>`;
      }
    } else if (dataOption === "inflation") {
      const country = inflationData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Inflation since 2010: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Inflation since 2010: <br /><i>No data</i>`;
      }
    } else if (dataOption === "employment") {
      const country = employmentData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Employment Rate: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Employment Rate: <br /><i>No data</i>`;
      }
    } else if (dataOption === "health") {
      const country = healthData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Health Expenditure (% of GDP): <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Health Expenditure (% of GDP): <br /><i>No data</i>`;
      }
    } else if (dataOption === "growth") {
      const country = growthData.find(
        (country) => country.cca2 === d.ISO_A2
      );
      if (country) {
        label += `Economic Growth: <br /><i>${country.value.toFixed(2)}%</i>`;
      } else {
        label += `Economic Growth: <br /><i>No data</i>`;
      }
    }
    label += `</div>`;
    return label;
};

export default polygonLabel;