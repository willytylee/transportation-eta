import { createContext, useState, useMemo, useCallback } from "react";

export const DirectionContext = createContext();

export const DirectionProvider = ({ children }) => {
  const [currRoute, setCurrRoute] = useState({});
  const [origination, setOrigination] = useState(null);
  const [destination, setDestination] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sortingDialogOpen, setSortingDialogOpen] = useState(false);
  const [sortingMethod, setSortingMethod] = useState("");
  const [fitBoundMode, setFitBoundMode] = useState("");

  const updateCurrRoute = useCallback((e) => {
    setCurrRoute(e);
  }, []);

  const updateOrigination = useCallback((e) => {
    setOrigination(e);
  }, []);

  const updateDestination = useCallback((e) => {
    setDestination(e);
  }, []);

  const updateExpanded = useCallback((e) => {
    setExpanded(e);
  }, []);

  const updateSortingDialogOpen = useCallback((e) => {
    setSortingDialogOpen(e);
  }, []);

  const updateSortingMethod = useCallback((e) => {
    setSortingMethod(e);
  }, []);

  const updateFitBoundMode = useCallback((e) => {
    setFitBoundMode(e);
  }, []);

  const value = useMemo(
    () => ({
      currRoute,
      updateCurrRoute,
      origination,
      updateOrigination,
      destination,
      updateDestination,
      expanded,
      updateExpanded,
      sortingDialogOpen,
      updateSortingDialogOpen,
      sortingMethod,
      updateSortingMethod,
      fitBoundMode,
      updateFitBoundMode,
    }),
    [
      currRoute,
      updateCurrRoute,
      origination,
      updateOrigination,
      destination,
      updateDestination,
      expanded,
      updateExpanded,
      sortingDialogOpen,
      updateSortingDialogOpen,
      sortingMethod,
      updateSortingMethod,
      fitBoundMode,
      updateFitBoundMode,
    ]
  );

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
};
