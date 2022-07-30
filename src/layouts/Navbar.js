import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
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

  const handleOnLinkClick = (user) => {
    localStorage.setItem("user", user);
  };

  let avgTemp = 0;
  if (Object.keys(currWeather).length !== 0) {
    const tempArr = currWeather.temperature.data;
    avgTemp = tempArr.reduce((a, b) => a + b.value, 0) / tempArr.length;
  } else {
    avgTemp = 0;
  }

  return (
    <Nav>
      <ul>
        {dataSet
          .filter((e) => e.display)
          .map((e, i) => {
            return (
              <li key={i}>
                <Link
                  to={`/personalAsst/${e.user}`}
                  onClick={() => handleOnLinkClick(e.user)}
                >
                  {e.name}
                </Link>
              </li>
            );
          })}
      </ul>
      <ul className="weather" onClick={handleWeatherOnClick}>
        <li>
          {avgTemp?.toFixed(1)}°C / {currWeather?.humidity?.data[0]?.value}%
          <img src={weatherIconMap[currWeather.icon]} alt="" />
          {Object.keys(warningMsg).map((e, i) => {
            return (
              <img key={i} src={warningIconMap[warningMsg[e].code]} alt="" />
            );
          })}
        </li>
      </ul>
    </Nav>
  );
};

const Nav = styled("nav")({
  backgroundColor: "#333",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "stretch",
  gap: "2rem",
  padding: "0 1rem",
  ul: {
    padding: "0",
    margin: "0",
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    fontSize: "20px",
    li: {
      color: "inherit",
      textDecoration: "none",
      height: "100%",
      display: "flex",
      alignItems: "center",
      padding: "0.25rem",
      "&.active": {
        backgroundColor: "#555",
      },
      a: {
        color: "white",
      },
    },
    "&.weather": {
      fontSize: "14px",
      img: {
        width: "20px",
        marginLeft: "8px",
      },
    },
  },
});
