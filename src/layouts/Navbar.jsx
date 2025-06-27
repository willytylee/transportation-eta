import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, styled, IconButton } from "@mui/material";
import { ArrowBackIosNew as ArrowBackIosNewIcon } from "@mui/icons-material";
import { fetchCurrWeather, fetchWarningList } from "../fetch/Weather";
import { warningIconMap, weatherIconMap } from "../constants/Weather";
import { navbarDetail, primaryColor } from "../constants/Constants";

export const Navbar = () => {
  const [currWeather, setCurrWeather] = useState({});
  const [warningMsg, setWarningMsg] = useState({});
  const [prevPage, setPrevPage] = useState("");
  const [title, setTitle] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    const key = Object.keys(navbarDetail).find((e) => e === pathname);
    const object = navbarDetail[key];
    object?.title ? setTitle(object.title) : setTitle("");
    object?.prevPage ? setPrevPage(object.prevPage) : setPrevPage("");
  }, [pathname]);

  useEffect(() => {
    const intervalContent = () => {
      fetchCurrWeather().then(
        (response) => response && setCurrWeather(response)
      );
      fetchWarningList().then(
        (response) => response && setWarningMsg(response)
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 120000);

    return () => clearInterval(interval);
  }, []);

  let avgTemp = 0;
  if (Object.keys(currWeather).length !== 0) {
    const tempArr = currWeather.temperature.data;
    avgTemp = tempArr.reduce((a, b) => a + b.value, 0) / tempArr.length;
  } else {
    avgTemp = 0;
  }

  return (
    <AppBarRoot position="static">
      <Toolbar>
        <ul>
          <li className="back">
            {prevPage !== "" && (
              <Link to={prevPage}>
                <IconButton>
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Link>
            )}
          </li>
        </ul>
        <ul className="title">{title}</ul>
        <ul>
          <li className="weather">
            <Link to="/weather">
              <div className="text">
                {avgTemp?.toFixed(1)}°C /{" "}
                {currWeather?.humidity?.data[0]?.value}%
              </div>
              <div className="img">
                <img src={weatherIconMap[currWeather.icon]} alt="" />
                {Object.keys(warningMsg).map((e, i) => (
                  <img
                    key={i}
                    src={warningIconMap[warningMsg[e].code]}
                    alt=""
                  />
                ))}
              </div>
            </Link>
          </li>
        </ul>
      </Toolbar>
    </AppBarRoot>
  );
};

const AppBarRoot = styled(AppBar)({
  backgroundColor: `${primaryColor}`,
  ".MuiToolbar-root": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    minHeight: "48px",
    paddingLeft: "8px",
    ul: {
      padding: "0",
      margin: "0",
      listStyle: "none",
      display: "flex",
      gap: "0.5rem",
      fontSize: "20px",
      color: "white",
      "&.title": {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "16px",
      },
      li: {
        color: "inherit",
        textDecoration: "none",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0.25rem",
        a: {
          color: "white",
          display: "flex",
          alignItems: "center",
          button: {
            color: "white",
          },
        },
        "&.weather": {
          fontSize: "12px",
          paddingRight: 0,
          a: {
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            ".img": {
              display: "flex",
              gap: "8px",
              img: {
                width: "14px",
              },
            },
          },
        },
      },
    },
  },
});
