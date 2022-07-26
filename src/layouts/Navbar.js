import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { dataSet } from "../data/DataSet";
import { fetchCurrWeather, fetchWarningList } from "../fetch/Weather";
import { warningIconMap, weatherIconMap } from "../constants/Weather";

export const Navbar = () => {
  const [currWeather, setCurrWeather] = useState({});
  const [warningMsg, setWarningMsg] = useState({});
  const navigate = useNavigate();
  const handleWeatherOnClick = useCallback(() => {
    navigate("/weather", { replace: true });
  }, [navigate]);

  useEffect(() => {
    fetchCurrWeather().then((response) => setCurrWeather(response));
    fetchWarningList().then((response) => setWarningMsg(response));
  }, []);

  let avgTemp = 0;
  if (Object.keys(currWeather).length !== 0) {
    const tempArr = currWeather.temperature.data;
    avgTemp = tempArr.reduce((a, b) => a + b.value, 0) / tempArr.length;
  } else {
    avgTemp = 0;
  }

  return (
    <nav className="nav">
      <ul>
        {dataSet
          .filter((e) => e.display)
          .map((e, i) => {
            return (
              <li key={i}>
                <Link to={`/personalAsst/${e.user}`}>{e.name}</Link>
              </li>
            );
          })}
      </ul>
      <ul className="weather" onClick={handleWeatherOnClick}>
        <li>
          {avgTemp?.toFixed(1)}°C / {currWeather?.humidity?.data[0]?.value}%
          <img src={weatherIconMap[currWeather.icon]} alt="" />
          {Object.keys(warningMsg).map((e, i) => (
            <img key={i} src={warningIconMap[e]} alt="" />
          ))}
        </li>
      </ul>
    </nav>
  );
};
