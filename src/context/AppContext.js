import { createContext, useState, useMemo } from "react";
import { compress as compressJson } from "lzutf8-light";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const dbVersionLocal = localStorage.getItem("dbVersion");
  const [dbVersion, setDbVersion] = useState(dbVersionLocal);
  const [location, setLocation] = useState({
    lat: 22.313879,
    lng: 114.186484,
  });
  const [error] = useState([]);

  const initDb = () => {
    const dbVersionLocal = localStorage.getItem("dbVersion");

    if (!dbVersionLocal || dbVersionLocal !== "0.0.1") {
      localStorage.clear();
      localStorage.setItem("dbVersion", "0.0.1");
      axios
        .get("https://hkbus.github.io/hk-bus-crawling/routeFareList.min.json")
        .then((response) => {
          setDbVersion("0.0.1");
          localStorage.setItem(
            "stopMap",
            compressJson(JSON.stringify(response.data.stopMap), {
              outputEncoding: "Base64",
            })
          );
          localStorage.setItem(
            "routeList",
            compressJson(JSON.stringify(response.data.routeList), {
              outputEncoding: "Base64",
            })
          );
          localStorage.setItem(
            "stopList",
            compressJson(JSON.stringify(response.data.stopList), {
              outputEncoding: "Base64",
            })
          );
        });
    }
  };

  const getGeoLocation = () => {
    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };
    const fail = (err) => {
      // setError((prevState) => {
      //   return [...prevState, err.message];
      // });
    };
    navigator.geolocation.getCurrentPosition(success, fail);
  };

  const value = useMemo(
    () => ({
      dbVersion,
      location,
      error,
      initDb,
      getGeoLocation,
    }),
    [dbVersion, location, error]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
