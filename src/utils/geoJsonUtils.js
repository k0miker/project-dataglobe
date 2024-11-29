import { useAppContext } from '../context/AppContext';

const getVal = (feat, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData) => {
    if (dataOption === "gdp") {
      return (
        feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST)
      );
    } else if (dataOption === "density") {
      const country = restCountriesData.find(
        (country) => country.cca3 === feat.properties.ISO_A3
      );
      if (country) {
        return country.population / Math.max(1, country.area);
      }
    } else if (dataOption === "mortality") {
      const country = mortalityData.find(
        (country) => country.cca2 === feat.properties.ISO_A2
      );
      if (country) {
        return country.value;
      }
    } else if (dataOption === "debt") {
      const country = debtData.find(
        (country) => country.cca2 === feat.properties.ISO_A2
      );
      if (country) {
        return country.value;
      }
    } else if (dataOption === "inflation") {
      const country = inflationData.find(
        (country) => country.cca2 === feat.properties.ISO_A2
      );
      if (country) {
        return Math.min(country.value, 1000)*10;
      }
    } else if (dataOption === "employment") {
      const country = employmentData.find(
        (country) => country.cca2 === feat.properties.ISO_A2
      );
      if (country) {
        return country.value;
      }
    } else if (dataOption === "health") {
      const country = healthData.find(
        (country) => country.cca2 === feat.properties.ISO_A2
      );
      if (country) {
        return country.value;
      }
    } else if (dataOption === "growth") {
      const country = growthData.find(
        (country) => country.cca2 === feat.properties.ISO_A2
      );
      if (country) {
        return country.value;
      }
    }
    return 0;
  };

export default getVal;