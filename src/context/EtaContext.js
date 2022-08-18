import { createContext, useState, useMemo, useCallback } from "react";

export const EtaContext = createContext();

export const EtaProvider = ({ children }) => {
  const [currRoute, setCurrRoute] = useState({});
  const [nearestStopId, setNearestStopId] = useState("");
  const [sectionCompareMode, setSectionCompareMode] = useState(false);
  const [mapLocation, setMapLocation] = useState(undefined);
  const [mapStopIdx, setMapStopIdx] = useState(-1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateCurrRoute = useCallback((route) => {
    setCurrRoute(route);
  });

  const updateNearestStopId = useCallback((nearestStopId) => {
    setNearestStopId(nearestStopId);
  });

  const updateSectionCompareMode = useCallback((mode) => {
    setSectionCompareMode(mode);
  });

  const updateMapLocation = useCallback((location) => {
    setMapLocation(location);
  });

  const updateMapStopIdx = useCallback((idx) => {
    setTimeout(() => {
      setMapStopIdx(idx);
    }, 500);
  });

  const value = useMemo(
    () => ({
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
      sectionCompareMode,
      updateSectionCompareMode,
      mapLocation,
      updateMapLocation,
      mapStopIdx,
      updateMapStopIdx,
    }),
    [
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
      sectionCompareMode,
      updateSectionCompareMode,
      mapLocation,
      updateMapLocation,
      mapStopIdx,
      updateMapStopIdx,
    ]
  );

  return <EtaContext.Provider value={value}>{children}</EtaContext.Provider>;
};
