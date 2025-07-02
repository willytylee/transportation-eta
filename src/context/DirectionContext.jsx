import { createContext, useState, useMemo, useCallback } from "react";

export const DirectionContext = createContext();

export const DirectionProvider = ({ children }) => {
  const [currRoute, setCurrRoute] = useState({});
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [mapCollapse, setMapCollapse] = useState(false);
  const [sortingDialogOpen, setSortingDialogOpen] = useState(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [displayDialogOpen, setDisplayDialogOpen] = useState(false);
  const [sortingMethod, setSortingMethod] = useState("最短總時間");
  const [displayMode, setDisplayMode] = useState("只顯示現時有班次路線");
  const [fitBoundMode, setFitBoundMode] = useState("");

  const updateCurrRoute = useCallback((e) => {
    setCurrRoute(e);
  }, []);

  const updateOrigin = useCallback((e) => {
    setOrigin(e);
  }, []);

  const updateDestination = useCallback((e) => {
    setDestination(e);
  }, []);

  const updateExpanded = useCallback((e) => {
    setExpanded(e);
  }, []);

  const updateMapCollapse = useCallback(() => {
    setMapCollapse((prev) => !prev);
  }, []);

  const updateSortingDialogOpen = useCallback((e) => {
    setSortingDialogOpen(e);
  }, []);

  const updateSettingDialogOpen = useCallback((e) => {
    setSettingDialogOpen(e);
  }, []);

  const updateDisplayDialogOpen = useCallback((e) => {
    setDisplayDialogOpen(e);
  }, []);

  const updateSortingMethod = useCallback((e) => {
    setSortingMethod(e);
  }, []);

  const updateDisplayMode = useCallback((e) => {
    setDisplayMode(e);
  }, []);

  const updateFitBoundMode = useCallback((e) => {
    setFitBoundMode(e);
  }, []);

  const value = useMemo(
    () => ({
      currRoute,
      updateCurrRoute,
      origin,
      updateOrigin,
      destination,
      updateDestination,
      expanded,
      updateExpanded,
      mapCollapse,
      updateMapCollapse,
      sortingDialogOpen,
      updateSortingDialogOpen,
      displayDialogOpen,
      updateDisplayDialogOpen,
      sortingMethod,
      updateSortingMethod,
      displayMode,
      updateDisplayMode,
      fitBoundMode,
      updateFitBoundMode,
      settingDialogOpen,
      updateSettingDialogOpen,
    }),
    [
      currRoute,
      updateCurrRoute,
      origin,
      updateOrigin,
      destination,
      updateDestination,
      expanded,
      updateExpanded,
      mapCollapse,
      updateMapCollapse,
      sortingDialogOpen,
      sortingMethod,
      updateSortingDialogOpen,
      displayDialogOpen,
      updateDisplayDialogOpen,
      displayMode,
      updateDisplayMode,
      updateSortingMethod,
      fitBoundMode,
      updateFitBoundMode,
      settingDialogOpen,
      updateSettingDialogOpen,
    ]
  );

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
};
