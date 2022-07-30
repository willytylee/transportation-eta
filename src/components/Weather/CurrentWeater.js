import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { fetchLocalForecast, fetchCurrWeather } from "../../fetch/Weather";
import { weatherIconMap } from "../../constants/Weather";

export const CurrentWeater = ({ tabIdx }) => {
  const [localForecast, setLocalForecast] = useState({});
  const [currWeather, setCurrWeather] = useState({});

  useEffect(() => {
    fetchCurrWeather().then((response) => setCurrWeather(response));
    fetchLocalForecast().then((response) => setLocalForecast(response));
  }, []);

  return (
    <CurrentWeatherRoot>
      <img src={weatherIconMap[currWeather.icon]} alt="" />
      <p>{currWeather.warningMessage}</p>
      <p>{localForecast.generalSituation}</p>
      <p>{localForecast.forecastPeriod}</p>
      <p>{localForecast.forecastDesc}</p>
      <p>展望: {localForecast.outlook}</p>
    </CurrentWeatherRoot>
  );
};

const CurrentWeatherRoot = styled("div")({
  img: {
    width: "60px",
  },
});
