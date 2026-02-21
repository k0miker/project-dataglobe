import { useAppContext } from '../context/AppContext';

const getVal = (feat, dataOption, restCountriesData, mortalityData, debtData, inflationData, employmentData, healthData, growthData, currentYear) => {
    // Resolve ISO code: Fallback to ADM0_A3 if ISO_A3 is invalid or "-99" (e.g. France, Norway)
    const isoCode = feat.properties.ISO_A3 === "FR" ? "FRA" : (feat.properties.ISO_A3 && feat.properties.ISO_A3 !== "-99"
      ? feat.properties.ISO_A3
      : feat.properties.ADM0_A3);

    if (dataOption === "gdp") {
      return (
        feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST)
      );
    } else if (dataOption === "density") {
      const country = restCountriesData.find(
        (country) => country.cca3 === isoCode
      );
      if (country) {
        return country.population / Math.max(1, country.area);
      }
    } else if (dataOption === "mortality") {
      const country = mortalityData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        return country.data[currentYear];
      }
    } else if (dataOption === "debt") {
      const country = debtData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        return country.data[currentYear];
      }
    } else if (dataOption === "inflation") {
      const country = inflationData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        return Math.min(country.data[currentYear], 1000)*10;
      }
    } else if (dataOption === "employment") {
      const country = employmentData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        return country.data[currentYear];
      }
    } else if (dataOption === "health") {
      const country = healthData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        return country.data[currentYear];
      }
    } else if (dataOption === "growth") {
      const country = growthData.find(
        (country) => country.cca3 === isoCode
      );
      if (country && country.data && country.data[currentYear]) {
        return country.data[currentYear];
      }
    }
    return 0;
  };

export default getVal;