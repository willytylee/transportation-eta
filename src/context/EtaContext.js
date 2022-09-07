import { createContext, useState, useMemo, useCallback } from "react";

export const EtaContext = createContext();

export const EtaProvider = ({ children }) => {
  const [currRoute, setCurrRoute] = useState({});
  const [route, setRoute] = useState("");
  const [nearestStopId, setNearestStopId] = useState("");
  const [mapLocation, setMapLocation] = useState(undefined);
  const [mapStopIdx, setMapStopIdx] = useState(-1);

  const updateRoute = useCallback((routeStr) => {
    setRoute(routeStr);
  }, []);

  const updateCurrRoute = useCallback((routeObj) => {
    setCurrRoute(routeObj);
  }, []);

  const updateNearestStopId = useCallback((stopId) => {
    setNearestStopId(stopId);
  }, []);

  const updateMapLocation = useCallback((location) => {
    setMapLocation(location);
  }, []);

  const updateMapStopIdx = useCallback((idx) => {
    setTimeout(() => {
      setMapStopIdx(idx);
    }, 500);
  }, []);

  const value = useMemo(
    () => ({
      route,
      updateRoute,
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
      mapLocation,
      updateMapLocation,
      mapStopIdx,
      updateMapStopIdx,
    }),
    [
      route,
      updateRoute,
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
      mapLocation,
      updateMapLocation,
      mapStopIdx,
      updateMapStopIdx,
    ]
  );

  return <EtaContext.Provider value={value}>{children}</EtaContext.Provider>;
};
