import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, styled } from "@mui/material";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { dataSet } from "../data/DataSet";
import { fetchCurrWeather, fetchWarningList } from "../fetch/Weather";
import { warningIconMap, weatherIconMap } from "../constants/Weather";
import { SwitchUserSnackBar } from "../components/SwitchUserSnackBar";
import { SelectUserMenu } from "../components/SelectUserMenu";

export const Navbar = () => {
  const [currWeather, setCurrWeather] = useState({});
  const [warningMsg, setWarningMsg] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const handleWeatherOnClick = useCallback(() => {
    navigate("/weather", { replace: true });
  }, [navigate]);

  useEffect(() => {
    fetchCurrWeather().then((response) => setCurrWeather(response));
    fetchWarningList().then((response) => setWarningMsg(response));
  }, []);

  const handleLinkOnClick = ({ user, name }) => {
    const oldUser = localStorage.getItem("user");
    if (oldUser !== user) {
      localStorage.setItem("user", user);
      setUsername(name);
      setSnackbarOpen(true);
    }
  };

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
            {dataSet
              .filter((e) => e.display)
              .map((e, i) => {
                return (
                  <li key={i}>
                    <Link
                      to={`/personalAsst/${e.user}`}
                      onClick={() =>
                        handleLinkOnClick({ user: e.user, name: e.name })
                      }
                    >
                      {e.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
          <ul className="right">
            <li className="weather" onClick={handleWeatherOnClick}>
              {avgTemp?.toFixed(1)}°C / {currWeather?.humidity?.data[0]?.value}%
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
            </li>
            <li className="user">
              <AccountCircleIcon onClick={handleClick} />
            </li>
          </ul>
        </Toolbar>
      </AppBarRoot>
      <SwitchUserSnackBar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        username={username}
      />
      <SelectUserMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
};

const AppBarRoot = styled(AppBar)({
  ".MuiToolbar-root": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
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
        "&.active": {
          backgroundColor: "#555",
        },
        a: {
          color: "white",
        },
      },
      ".weather": {
        fontSize: "14px",
        img: {
          width: "20px",
          marginLeft: "8px",
        },
      },
      ".user": {},
    },
  },
});
