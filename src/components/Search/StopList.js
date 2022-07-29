import { useState, useEffect, useMemo, useContext } from "react";
import { styled } from "@mui/material";
import { getPreciseDistance } from "geolib";
import { getLocalStorage } from "../../Utils";
import { Card } from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { StopEta } from "./StopEta";
import { coPriority } from "../../constants/Bus";

export const StopList = ({ route }) => {
  const [stopList, setStopList] = useState([]);
  const [closestStopId, setClosestStopId] = useState("");
  const {
    dbVersion,
    location: currentLocation,
    currRoute,
  } = useContext(AppContext);

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const getCoPriorityId = (currRoute) => {
    let companyId = "";
    for (let e of coPriority) {
      if (Object.keys(currRoute.stops).includes(e)) {
        companyId = e;
        break;
      }
    }
    return companyId;
  };

  // When the route number is changed
  useEffect(() => {
    setStopList([]);
  }, [route]);

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      // Find the company Id which appear in currRoute.stops

      const companyId = getCoPriorityId(currRoute);
      const expandStopIdList = currRoute.stops[companyId];

      setStopList(
        expandStopIdList.map((e) => ({ ...gStopList[e], stopId: e }))
      );
    }
  }, [currRoute]);

  // When the route list is clicked and location is changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      const companyId = getCoPriorityId(currRoute);
      const expandStopIdList = currRoute.stops[companyId];

      setClosestStopId(
        expandStopIdList.reduce((prev, curr) => {
          const prevDistance = getPreciseDistance(
            {
              latitude: gStopList[prev].location.lat,
              longitude: gStopList[prev].location.lng,
            },
            { latitude: currentLocation.lat, longitude: currentLocation.lng }
          );
          const currDistance = getPreciseDistance(
            {
              latitude: gStopList[curr].location.lat,
              longitude: gStopList[curr].location.lng,
            },
            { latitude: currentLocation.lat, longitude: currentLocation.lng }
          );

          if (prevDistance < currDistance) {
            return prev;
          }
          return curr;
        })
      );
    }
  }, [currRoute, currentLocation.lat, currentLocation.lng]);

  return (
    <StopListRoot>
      {Object.keys(currRoute).length !== 0 &&
        stopList?.map((e, i) => {
          const isClosestStop = gStopList[closestStopId]?.name === e.name;
          return (
            <StopEta
              key={i}
              seq={i + 1}
              routeObj={currRoute}
              stopObj={e}
              isClosestStop={isClosestStop}
            />
          );
        })}
    </StopListRoot>
  );
};

const StopListRoot = styled("div")({
  width: "100%",
});
