import { createContext, useState, useMemo, useCallback } from "react";

export const EtaContext = createContext();

export const EtaProvider = ({ children }) => {
  const [route, setRoute] = useState("");
  const [stopId, setStopId] = useState("");
  const [nearestStopId, setNearestStopId] = useState("");
  const [mapLocation, setMapLocation] = useState(undefined);
  const [mapStopIdx, setMapStopIdx] = useState(-1);

  const updateRoute = useCallback((_route) => {
    setRoute(_route);
  }, []);

  const updateStopId = useCallback((_stopId) => {
    setStopId(_stopId);
  });

  const updateNearestStopId = useCallback((_stopId) => {
    setNearestStopId(_stopId);
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
      stopId,
      updateStopId,
      nearestStopId,
      updateNearestStopId,
      mapLocation,
      updateMapLocation,
      mapStopIdx,
      updateMapStopIdx,
    }),
    [route, updateRoute, stopId, updateStopId, nearestStopId, updateNearestStopId, mapLocation, updateMapLocation, mapStopIdx, updateMapStopIdx]
  );

  return <EtaContext.Provider value={value}>{children}</EtaContext.Provider>;
};
