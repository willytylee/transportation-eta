import axios from "axios";

export const fetch9DForecast = async () => {
  const response = await axios.get(
    `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc`
  );

  return response.data;
};

export const fetchLocalForecast = async () => {
  const response = await axios.get(
    `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc`
  );

  return response.data;
};

export const fetchCurrWeather = async () => {
  const response = await axios.get(
    `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc`
  );

  return response.data;
};

export const fetchWarningList = async () => {
  const response = await axios.get(
    `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=tc`
  );

  return response.data;
};
