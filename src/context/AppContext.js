import { createContext, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { fetchVersion } from "../fetch/Version";
import { setLocalStorage } from "../Utils/Utils";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const dbVersionLocal = localStorage.getItem("dbVersion");

  const [dbVersion, setDbVersion] = useState(dbVersionLocal);
  const [location, setLocation] = useState({
    lat: 22.313879,
    lng: 114.186484,
  });
  const [appVersion, setAppVersion] = useState("");
  const [serVersion, setSerVersion] = useState("");

  /* eslint-disable react-hooks/exhaustive-deps */
  const getGeoLocation = useCallback(() => {
    const intervalContent = async () => {
      const success = (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      };

      navigator.geolocation.getCurrentPosition(success);
    };
    intervalContent();
    setInterval(intervalContent, 1000);
  }, []);

  const initAppVersion = useCallback(() => {
    fetchVersion().then((version) => {
      setAppVersion(version);
    });

    const intervalContent = async () => {
      fetchVersion().then((version) => {
        setSerVersion(version);
      });
    };

    intervalContent();
    setInterval(intervalContent, 60000);
  }, []);

  const initDb = useCallback(() => {
    const stopMapLocal = localStorage.getItem("stopMap");
    const routeListLocal = localStorage.getItem("routeList");
    const stopListLocal = localStorage.getItem("stopList");

    if (
      !dbVersionLocal ||
      !stopMapLocal ||
      !routeListLocal ||
      !stopListLocal ||
      dbVersionLocal !== "0.0.1"
    ) {
      localStorage.removeItem("dbVersion");
      localStorage.removeItem("stopMap");
      localStorage.removeItem("routeList");
      localStorage.removeItem("stopList");
      localStorage.setItem("dbVersion", "0.0.1");
      axios
        .get("https://hkbus.github.io/hk-bus-crawling/routeFareList.min.json")
        .then((response) => {
          setDbVersion("0.0.1");
          setLocalStorage("stopMap", response.data.stopMap);
          setLocalStorage("routeList", response.data.routeList);
          setLocalStorage("stopList", response.data.stopList);
        });
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */

  const value = useMemo(
    () => ({
      dbVersion,
      location,
      initDb,
      getGeoLocation,
      initAppVersion,
      appVersion,
      serVersion,
    }),
    [
      dbVersion,
      location,
      initDb,
      getGeoLocation,
      initAppVersion,
      appVersion,
      serVersion,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
