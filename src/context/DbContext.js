import { createContext, useContext, useMemo } from "react";
import { getLocalStorage } from "../Utils/Utils";
import { AppContext } from "./AppContext";

export const DbContext = createContext();

export const DbProvider = ({ children }) => {
  const { dbVersion } = useContext(AppContext);

  /* eslint-disable react-hooks/exhaustive-deps */
  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);
  const gRouteList = useMemo(() => getLocalStorage("routeList"), [dbVersion]);
  const gStopMap = useMemo(() => getLocalStorage("stopMap"), [dbVersion]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const value = useMemo(
    () => ({ gStopList, gRouteList, gStopMap }),
    [gStopList, gRouteList, gStopMap]
  );

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};
