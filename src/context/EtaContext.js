import { createContext, useState, useMemo, useCallback } from "react";

export const EtaContext = createContext();

export const EtaProvider = ({ children }) => {
  let userIdLocal;
  try {
    userIdLocal = JSON.parse(localStorage.getItem("user")).userId;
  } catch (error) {
    userIdLocal = -1;
  }
  const [currRoute, setCurrRoute] = useState({});
  const [nearestStopId, setNearestStopId] = useState("");

  const updateCurrRoute = useCallback((route) => {
    setCurrRoute(route);
  });

  const updateNearestStopId = useCallback((nearestStopId) => {
    setNearestStopId(nearestStopId);
  });

  const value = useMemo(
    () => ({
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
    }),
    [currRoute, updateCurrRoute, nearestStopId, updateNearestStopId]
  );

  return <EtaContext.Provider value={value}>{children}</EtaContext.Provider>;
};
