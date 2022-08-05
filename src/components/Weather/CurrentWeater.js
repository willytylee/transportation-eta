import { useState, useEffect } from "react";
import moment from "moment";
import { styled } from "@mui/material";
import { fetchLocalForecast, fetchCurrWeather } from "../../fetch/Weather";
import { weatherIconMap } from "../../constants/Weather";

export const CurrentWeater = () => {
  const [localForecast, setLocalForecast] = useState({});
  const [currWeather, setCurrWeather] = useState({});

  useEffect(() => {
    const intervalContent = () => {
      fetchCurrWeather().then(
        (response) => response && setCurrWeather(response)
      );
      fetchLocalForecast().then(
        (response) => response && setLocalForecast(response)
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CurrentWeatherRoot>
      <img src={weatherIconMap[currWeather.icon]} alt="" />
      <p>{currWeather.warningMessage}</p>
      <p>{localForecast.generalSituation}</p>
      <p>{localForecast.tcInfo}</p>
      <p>{localForecast.forecastPeriod}</p>
      <p>{localForecast.forecastDesc}</p>
      <p>展望: {localForecast.outlook}</p>
      <p>
        {moment(localForecast.updateTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY年MM月DD日HH時mm分更新"
        )}
      </p>
    </CurrentWeatherRoot>
  );
};

const CurrentWeatherRoot = styled("div")({
  img: {
    width: "60px",
    filter: "drop-shadow(0px 0px 0px black)",
  },
});
