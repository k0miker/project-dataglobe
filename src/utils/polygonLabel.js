import { useAppContext } from '../context/AppContext';

const polygonLabel = ({ properties: d }, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData, currentYear) => {
    // Resolve ISO code: Fallback to ADM0_A3 if ISO_A3 is invalid or "-99" (e.g. France, Norway)
    const isoCode = d.ISO_A3 === "FR" ? "FRA" : (d.ISO_A3 && d.ISO_A3 !== "-99"
      ? d.ISO_A3
      : d.ADM0_A3);

    let label = `<div class="globe-label"><b>${d.ADMIN} (${d.ISO_A2}):</b> <br /> <br />`;
    if (dataOption === "gdp") {
      label += `Population: <br /><i>${(d.POP_EST / 1e6).toFixed(2)} million</i><br/>`;
      label += `GDP: <br /><i>${(d.GDP_MD_EST / 1e3).toFixed(2)} billion $</i><br>`;
      label += `Economy: <br /> <i>${d.ECONOMY}</i><br>`;
      label += `<i>${d.INCOME_GRP}</i>`;
    } else if (dataOption === "density") {
      const country = restCountriesData.find(
        (country) => country.cca3 === isoCode
      );
      if (country) {
        label += `Population: <br /><i>${(country.population / 1e6).toFixed(2)} million</i><br/>`;
        label += `Population Density: <br /><i>${(country.population / country.area).toFixed(2)} people/km²</i>`;
      } else {
        label += `Population Density: <br /><i>No data</i>`;
      }
    } else if (dataOption === "mortality") {
      const country = mortalityData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        label += `Mortality Rate (${currentYear}): <br /><i>${country.data[currentYear].toFixed(2)}%</i>`;
      } else {
        label += `Mortality Rate (${currentYear}): <br /><i>No data</i>`;
      }
    } else if (dataOption === "debt") {
      const country = debtData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        label += `Debt (% of GDP) (${currentYear}): <br /><i>${country.data[currentYear].toFixed(2)}%</i>`;
      } else {
        label += `Debt (% of GDP) (${currentYear}): <br /><i>No data</i>`;
      }
    } else if (dataOption === "inflation") {
      const country = inflationData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        label += `Inflation (${currentYear}): <br /><i>${country.data[currentYear].toFixed(2)}%</i>`;
      } else {
        label += `Inflation (${currentYear}): <br /><i>No data</i>`;
      }
    } else if (dataOption === "employment") {
      const country = employmentData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        label += `Unemployment Rate (${currentYear}): <br /><i>${country.data[currentYear].toFixed(2)}%</i>`;
      } else {
        label += `Unemployment Rate (${currentYear}): <br /><i>No data</i>`;
      }
    } else if (dataOption === "health") {
      const country = healthData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        label += `Life Expectancy (${currentYear}): <br /><i>${country.data[currentYear].toFixed(2)} years</i>`;
      } else {
        label += `Life Expectancy (${currentYear}): <br /><i>No data</i>`;
      }
    } else if (dataOption === "growth") {
      const country = growthData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        label += `Economic Growth (${currentYear}): <br /><i>${country.data[currentYear].toFixed(2)}%</i>`;
      } else {
        label += `Economic Growth (${currentYear}): <br /><i>No data</i>`;
      }
    }
    label += `</div>`;
    return label;
};

export default polygonLabel;