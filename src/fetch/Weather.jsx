import axios from "axios";

export const fetch9DForecast = async () => {
  try {
    const response = await axios.get(
      `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc`
    );
    return response.data;
  } catch (error) {
    // TODO
  }
};

export const fetchLocalForecast = async () => {
  try {
    const response = await axios.get(
      `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc`
    );
    return response.data;
  } catch (error) {
    // TODO
  }
};

export const fetchCurrWeather = async () => {
  try {
    const response = await axios.get(
      `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc`
    );
    return response.data;
  } catch (error) {
    // TODO
  }
};

export const fetchWarningList = async () => {
  try {
    const response = await axios.get(
      `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=tc`
    );
    return response.data;
  } catch (error) {
    // TODO
  }
};
