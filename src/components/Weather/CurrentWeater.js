import { useState, useEffect } from "react";
import moment from "moment";
import { styled } from "@mui/material";
import {
  fetchLocalForecast,
  fetchCurrWeather,
  fetchWarningList,
} from "../../fetch/Weather";
import { warningIconMap, weatherIconMap } from "../../constants/Weather";

export const CurrentWeater = () => {
  const [localForecast, setLocalForecast] = useState({});
  const [currWeather, setCurrWeather] = useState({});
  const [warningMsg, setWarningMsg] = useState({});

  useEffect(() => {
    const intervalContent = () => {
      fetchCurrWeather().then(
        (response) => response && setCurrWeather(response)
      );
      fetchLocalForecast().then(
        (response) => response && setLocalForecast(response)
      );
      fetchWarningList().then(
        (response) => response && setWarningMsg(response)
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CurrentWeatherRoot>
      <div className="image">
        <div className="currentImg">
          <img src={weatherIconMap[currWeather.icon]} alt="" />
        </div>
        <div className="warningImg">
          {Object.keys(warningMsg).map((e, i) => (
            <img key={i} src={warningIconMap[warningMsg[e].code]} alt="" />
          ))}
        </div>
      </div>

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
  ".image": {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: "22px",
    ".currentImg": {
      img: {
        width: "60px",
        filter: "drop-shadow(0px 0px 0px black)",
      },
    },
    ".warningImg": {
      display: "flex",
      gap: "8px",
      img: {
        width: "40px",
        filter: "drop-shadow(0px 0px 0px black)",
      },
    },
  },
});
