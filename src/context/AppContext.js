import { createContext, useState, useMemo, useCallback } from "react";
import { compress as compressJson } from "lzutf8-light";
import axios from "axios";
import { fetchVersion } from "../fetch/Version";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const dbVersionLocal = localStorage.getItem("dbVersion");
  const [dbVersion, setDbVersion] = useState(dbVersionLocal);
  const [location, setLocation] = useState({
    lat: 22.313879,
    lng: 114.186484,
  });
  const [currRoute, setCurrRoute] = useState({});
  const [appVersion, setAppVersion] = useState("");
  const [serVersion, setSerVersion] = useState("");
  const [nearestStopId, setNearestStopId] = useState("");

  const getGeoLocation = useCallback(() => {
    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    navigator.geolocation.watchPosition(success);
  }, []);

  const updateCurrRoute = useCallback((route) => {
    setCurrRoute(route);
  });

  const updateNearestStopId = useCallback((nearestStopId) => {
    setNearestStopId(nearestStopId);
  });

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
  });

  const initDb = useCallback(() => {
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
  });

  const value = useMemo(
    () => ({
      dbVersion,
      location,
      initDb,
      getGeoLocation,
      currRoute,
      updateCurrRoute,
      initAppVersion,
      appVersion,
      serVersion,
      nearestStopId,
      updateNearestStopId,
    }),
    [
      dbVersion,
      location,
      initDb,
      getGeoLocation,
      currRoute,
      updateCurrRoute,
      initAppVersion,
      appVersion,
      serVersion,
      nearestStopId,
      updateNearestStopId,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
