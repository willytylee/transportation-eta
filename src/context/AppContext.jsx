import { createContext, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { fetchVersion } from "../fetch/Version";
import {
  setLocalStorage,
  getLocalStorage,
  upgradeBookmark,
} from "../utils/Utils";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const dbVersionLocal = localStorage.getItem("dbVersion");

  const [dbVersion, setDbVersion] = useState(dbVersionLocal);
  const [appVersion, setAppVersion] = useState("");
  const [serVersion, setSerVersion] = useState("");

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
    const bookmarkV2 = localStorage.getItem("bookmarkV2");

    if (
      !dbVersionLocal ||
      !stopMapLocal ||
      !routeListLocal ||
      !stopListLocal ||
      dbVersionLocal !== "0.0.1" ||
      !bookmarkV2
    ) {
      localStorage.removeItem("dbVersion");
      localStorage.removeItem("stopMap");
      localStorage.removeItem("routeList");
      localStorage.removeItem("stopList");
      localStorage.setItem("dbVersion", "0.0.1");
      axios
        .get("https://data.hkbus.app/routeFareList.min.json")
        .then((response) => {
          setDbVersion("0.0.1");
          setLocalStorage("stopMap", response.data.stopMap);
          setLocalStorage("routeList", response.data.routeList);
          setLocalStorage("stopList", response.data.stopList);
          const bookmark = getLocalStorage("bookmark") || [];
          const _bookmarkV2 = upgradeBookmark(bookmark);
          setLocalStorage("bookmarkV2", _bookmarkV2);
          localStorage.setItem(
            "bookmarkV2_nocompress",
            JSON.stringify(_bookmarkV2)
          );
        });
    }
  }, []);

  const value = useMemo(
    () => ({
      dbVersion,
      initDb,
      initAppVersion,
      appVersion,
      serVersion,
    }),
    [dbVersion, initDb, initAppVersion, appVersion, serVersion]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
