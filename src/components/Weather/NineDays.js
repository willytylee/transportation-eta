import { useState, useEffect } from "react";
import { TabPanel } from "./TabPanel";
import moment from "moment";
import { fetch9DForecast } from "../../fetch/Weather";
import { weatherIconMap, psrIconMap } from "../../constants/Weather";
import { getHeatIndex } from "../../Utils";

export const NineDays = ({ tabIdx }) => {
  const [nineDForecast, setNineDForecast] = useState({});

  useEffect(() => {
    fetch9DForecast().then((response) => setNineDForecast(response));
  }, []);

  return (
    <TabPanel value={tabIdx} index={1} className="tabPanel">
      {nineDForecast?.generalSituation}
      <hr />
      {nineDForecast?.weatherForecast?.map((e, i) => {
        const displayDate = moment(e.forecastDate, "YYYYMMDD").format("M月D日");
        let psrIdx = 0;
        switch (e.PSR) {
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
        const avgHumidity = (e.forecastMinrh.value + e.forecastMaxrh.value) / 2;
        const heatIndex = getHeatIndex(
          e.forecastMaxtemp.value,
          avgHumidity
        ).toFixed(1);

        let heatWarning = "";
        let warningColor = "";
        if (heatIndex > 55) {
          heatWarning = "非常危險 - 隨時出現中暑";
          warningColor = "#AA0100";
        } else if (heatIndex > 40) {
          heatWarning = "危險 - 可能出現熱衰竭";
          warningColor = "#FF4D00";
        } else if (heatIndex > 30) {
          heatWarning = "加倍小心 - 有機會出現抽筋及熱衰竭";
          warningColor = "#FFCC01";
        }

        return (
          <table key={i} className="nineDaysTable">
            <thead>
              <tr>
                <th colSpan="3">
                  {displayDate} ({e.week.slice(-1)})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="iconRow">
                  <img src={weatherIconMap[e.ForecastIcon]} alt="" />
                </td>
                <td className="detailRow">
                  <div>
                    {e.forecastMintemp.value} - {e.forecastMaxtemp.value}°C{" "}
                    {e.forecastMinrh.value} - {e.forecastMaxrh.value}%
                  </div>
                  <div>{e.forecastWeather}</div>
                  <div>{e.forecastWind}</div>
                  <div>
                    酷熱指標:{" "}
                    <span style={{ color: `${warningColor}` }}>
                      {heatWarning}
                    </span>
                  </div>
                </td>
                <td className="psrRow">
                  <img src={psrIconMap[psrIdx]} alt="" />
                  <div>{e.PSR}</div>
                </td>
              </tr>
            </tbody>
          </table>
        );
      })}
    </TabPanel>
  );
};
