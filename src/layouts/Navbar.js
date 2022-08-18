import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, styled } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { fetchCurrWeather, fetchWarningList } from "../fetch/Weather";
import { warningIconMap, weatherIconMap } from "../constants/Weather";
import { SelectUserMenu } from "../components/SelectUserMenu";

export const Navbar = () => {
  const [currWeather, setCurrWeather] = useState({});
  const [warningMsg, setWarningMsg] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    const interval = setInterval(intervalContent, 10000);

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
    <>
      <AppBarRoot position="static">
        <Toolbar>
          <ul className="left">
            <li></li>
          </ul>
          <ul className="right">
            <li className="weather">
              <Link to="/weather">
                {avgTemp?.toFixed(1)}°C /{" "}
                {currWeather?.humidity?.data[0]?.value}%
                <img src={weatherIconMap[currWeather.icon]} alt="" />
                {Object.keys(warningMsg).map((e, i) => {
                  return (
                    <img
                      key={i}
                      src={warningIconMap[warningMsg[e].code]}
                      alt=""
                    />
                  );
                })}
              </Link>
            </li>
            {/* <li className="compareList">
              <Link
                to="/compare"
                onClick={() => updateSectionCompareMode(true)}
              >
                <FormatListBulletedIcon />
              </Link>
            </li> */}
            <li className="settings">
              <Link to="/settings">
                <SettingsIcon />
              </Link>
            </li>
          </ul>
        </Toolbar>
      </AppBarRoot>
      <SelectUserMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
};

const AppBarRoot = styled(AppBar)({
  backgroundColor: "#2f305c",
  ".MuiToolbar-root": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    minHeight: "36px",
    ul: {
      padding: "0",
      margin: "0",
      listStyle: "none",
      display: "flex",
      gap: "0.5rem",
      fontSize: "20px",
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
        },
      },
      ".weather": {
        fontSize: "14px",
        img: {
          width: "20px",
          marginLeft: "8px",
        },
      },
    },
  },
});
