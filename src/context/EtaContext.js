import { createContext, useState, useMemo, useCallback } from "react";

export const EtaContext = createContext();

export const EtaProvider = ({ children }) => {
  const [currRoute, setCurrRoute] = useState({});
  const [nearestStopId, setNearestStopId] = useState("");
  const [sectionCompareMode, setSectionCompareMode] = useState(false);

  const updateCurrRoute = useCallback((route) => {
    setCurrRoute(route);
  });

  const updateNearestStopId = useCallback((nearestStopId) => {
    setNearestStopId(nearestStopId);
  });

  const updateSectionCompareMode = useCallback((mode) => {
    setSectionCompareMode(mode);
  });

  const value = useMemo(
    () => ({
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
      sectionCompareMode,
      updateSectionCompareMode,
    }),
    [
      currRoute,
      updateCurrRoute,
      nearestStopId,
      updateNearestStopId,
      sectionCompareMode,
      updateSectionCompareMode,
    ]
  );

  return <EtaContext.Provider value={value}>{children}</EtaContext.Provider>;
};
