import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material/";
import moment from "moment";
import { TabPanel } from "../components/Weather/TabPanel";
import {
  fetch9DForecast,
  fetchLocalForecast,
  fetchCurrWeather,
} from "../fetch/Weather";
import { weatherIconMap } from "../constants/Weather";
import { psrIconMap } from "../constants/Weather";
import { getHeatIndex } from "../Utils";

export const Weather = () => {
  const [nineDForecast, setNineDForecast] = useState({});
  const [localForecast, setLocalForecast] = useState({});
  const [currWeather, setCurrWeather] = useState({});
  const [tabIdx, setTabIdx] = useState(0);

  const handleChange = (e, value) => {
    setTabIdx(value);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });

  useEffect(() => {
    fetchCurrWeather().then((response) => setCurrWeather(response));
    fetchLocalForecast().then((response) => setLocalForecast(response));
    fetch9DForecast().then((response) => setNineDForecast(response));
  }, []);

  return (
    <>
      <Tabs
        value={tabIdx}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="本港現時天氣及預報" {...a11yProps(0)} />
        <Tab label="九天天氣預報" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabIdx} index={0} className="tabPanel currWeather">
        <img src={weatherIconMap[currWeather.icon]} alt="" />
        <p>{currWeather.warningMessage}</p>
        <p>{localForecast.generalSituation}</p>
        <p>{localForecast.forecastPeriod}</p>
        <p>{localForecast.forecastDesc}</p>
        <p>展望: {localForecast.outlook}</p>
      </TabPanel>
      <TabPanel value={tabIdx} index={1} className="tabPanel">
        {nineDForecast?.generalSituation}
        <hr />
        {nineDForecast?.weatherForecast?.map((e, i) => {
          const displayDate = moment(e.forecastDate, "YYYYMMDD").format(
            "M月D日"
          );
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
          const avgHumidity =
            (e.forecastMinrh.value + e.forecastMaxrh.value) / 2;
          const heatIndex = getHeatIndex(
            e.forecastMaxtemp.value,
            avgHumidity
          ).toFixed(1);

          let heatWarning = "";
          let warningColor = "";
          if (heatIndex > 55) {
            heatWarning = "非常危險 - 隨時出現中暑";
            warningColor = "#C70039";
          } else if (heatIndex > 40) {
            heatWarning = "危險 - 可能出現熱衰竭";
            warningColor = "#FFC300";
          } else if (heatIndex > 30) {
            heatWarning = "加倍小心 - 有機會出現抽筋及熱衰竭";
            warningColor = "#FF5733";
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
    </>
  );
};
