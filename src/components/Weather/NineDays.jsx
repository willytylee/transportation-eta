import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import moment from "moment";
import { fetch9DForecast } from "../../fetch/Weather";
import { weatherIconMap, psrIconMap } from "../../constants/Weather";
import { getHeatIndex } from "../../utils/Utils";

export const NineDays = () => {
  const [nineDForecast, setNineDForecast] = useState({});

  useEffect(() => {
    const intervalContent = () => {
      fetch9DForecast().then(
        (response) => response && setNineDForecast(response)
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 120000);

    return () => clearInterval(interval);
  }, []);

  const getPsrIdx = (PSR) => {
    let psrIdx = 0;
    switch (PSR) {
      case "低":
        psrIdx = 1;
        break;
      case "中低":
        psrIdx = 2;
        break;
      case "中":
        psrIdx = 3;
        break;
      case "中高":
        psrIdx = 4;
        break;
      case "高":
        psrIdx = 5;
        break;

      default:
        break;
    }
    return psrIdx;
  };

  const getWarning = (minTemp, maxTemp, minRh, maxRh) => {
    const heatIndex = getHeatIndex(
      (maxTemp + minTemp) / 2,
      (minRh + maxRh) / 2
    ).toFixed(1);

    let heatWarning = "";
    let warningColor = "";
    if (heatIndex > 55) {
      heatWarning = "酷熱指標: 非常危險 - 隨時出現中暑";
      warningColor = "#AA0100";
    } else if (heatIndex > 40) {
      heatWarning = "酷熱指標: 危險 - 可能出現熱衰竭";
      warningColor = "#FF4D00";
    } else if (heatIndex > 30) {
      heatWarning = "酷熱指標: 加倍小心 - 有機會出現抽筋及熱衰竭";
      warningColor = "#FFCC01";
    }
    return { heatWarning, warningColor };
  };

  return (
    <NineDaysRoot>
      {nineDForecast?.generalSituation}
      <hr />
      {nineDForecast?.weatherForecast?.map((e, i) => {
        const minTemp = e.forecastMintemp.value;
        const maxTemp = e.forecastMaxtemp.value;
        const minRh = e.forecastMinrh.value;
        const maxRh = e.forecastMaxrh.value;
        return (
          <div key={i} className="nineDaysList">
            <div>
              {moment(e.forecastDate, "YYYYMMDD").format("M月D日")} (
              {e.week.slice(-1)})
            </div>
            <div className="nineDaysDetail">
              <div className="iconRow">
                <img src={weatherIconMap[e.ForecastIcon]} alt="" />
              </div>
              <div className="detailRow">
                <div>
                  {minTemp} - {maxTemp}°C {minRh} - {maxRh}%
                </div>
                <div>{e.forecastWeather}</div>
                <div>{e.forecastWind}</div>
                <div
                  style={{
                    color: getWarning(minTemp, maxTemp, minRh, maxRh)
                      .warningColor,
                  }}
                >
                  {getWarning(maxTemp, minRh, maxRh).heatWarning}
                </div>
              </div>
              <div className="psrRow">
                <img src={psrIconMap[getPsrIdx(e.PSR)]} alt="" />
                <div>{e.PSR}</div>
              </div>
            </div>
          </div>
        );
      })}
    </NineDaysRoot>
  );
};

const NineDaysRoot = styled("div")({
  ".nineDaysList": {
    width: "100%",
    marginBottom: "4px",
    borderBottom: "1px solid lightgrey",
    paddingBottom: "4px",
    ".nineDaysDetail": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      ".iconRow": {
        width: "20%",
        textAlign: "center",
        img: {
          width: "100%",
          filter: "drop-shadow(0px 0px 0px black)",
          maxWidth: "50px",
        },
      },
      ".detailRow": {
        width: "70%",
        textAlign: "left",
      },
      ".psrRow": {
        width: "10%",
        textAlign: "center",
        img: {
          width: "100%",
          maxWidth: "30px",
        },
      },
    },
  },
});
