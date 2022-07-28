import { useState, useEffect, useMemo, useContext } from "react";
import { getPreciseDistance } from "geolib";
import { getLocalStorage } from "../../Utils";
import { Card } from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { StopEta } from "./StopEta";

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

  const gStopMap = useMemo(() => {
    return getLocalStorage("stopMap");
  }, [dbVersion]);

  // When the route number is changed
  useEffect(() => {
    setStopList([]);
  }, [route]);

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      const companyId = currRoute.co[0];
      const expandStopIdList = currRoute.stops[companyId];

      setStopList(
        expandStopIdList.map((e) => ({ ...gStopList[e], stopId: e }))
      );
    }
  }, [currRoute]);

  // When the route list is clicked and location is changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      const companyId = currRoute.co[0];
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
    <Card>
      <table className="searchResultTable">
        <tbody>
          {Object.keys(currRoute).length !== 0 &&
            stopList &&
            stopList.map((e, i) => {
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
        </tbody>
      </table>
    </Card>
  );
};
