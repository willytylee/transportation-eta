import { useState, useEffect, useMemo, useContext } from "react";
import { getPreciseDistance } from "geolib";
import { Card } from "@mui/material";
import { StopEta } from "./StopEta";
import { getLocalStorage } from "../../Utils";
import { AppContext } from "../../context/AppContext";
import { companyMap } from "../../constants/Bus";

export const SearchResult = ({ route, open }) => {
  const [routeList, setRouteList] = useState([]);
  const [stopList, setStopList] = useState([]);
  const [closestStopId, setClosestStopId] = useState("");
  const [expandIdx, setExpandIdx] = useState(-1);
  const {
    dbVersion,
    location: currentLocation,
    updateCurrRoute,
    currRoute,
  } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const handleCardOnClick = (i) => {
    setExpandIdx(i);
  };

  const compareTwoArray = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  // When the route number is changed
  useEffect(() => {
    setStopList([]);
    setExpandIdx(-1);

    if (route) {
      setRouteList(
        Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => {
            return (
              e.route === route &&
              // compareTwoArray(e.co, Object.keys(e.stops)) &&
              (e.co.includes("kmb") ||
                e.co.includes("nwfb") ||
                e.co.includes("ctb"))
            );
          })
          .sort(
            (a, b) => parseInt(a.serviceType, 10) - parseInt(b.serviceType, 10)
          )
      );
    } else {
      setRouteList([]);
      updateCurrRoute({});
    }
  }, [route]);

  // When the route list is clicked
  useEffect(() => {
    if (route && expandIdx !== -1) {
      const expandRoute = routeList[expandIdx];
      updateCurrRoute(expandRoute);
    }
  }, [expandIdx]);

  // When the currRoute in AppContext changed
  useEffect(() => {
    if (Object.keys(currRoute).length !== 0) {
      const companyId = currRoute.co[0];
      const expandStopIdList = currRoute.stops[companyId];

      setStopList(
        expandStopIdList.map((e) => {
          return { ...gStopList[e], stopId: e };
        })
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
    <div className="searchResult" style={{ opacity: open ? "20%" : "100%" }}>
      {routeList.map((e, i) => {
        return (
          <div key={i} onClick={() => handleCardOnClick(i)}>
            <Card className={"searchResultCard"} variant="outlined">
              <div
                className="routeTitle"
                style={
                  JSON.stringify(currRoute) === JSON.stringify(e)
                    ? { backgroundColor: "lightyellow" }
                    : {}
                }
              >
                <div className="company">
                  {e.co.map((e) => companyMap[e]).join("+")}{" "}
                </div>
                <div className="origDest">
                  {e.orig.zh} → <span className="dest">{e.dest.zh}</span>
                  <span className="special">
                    {" "}
                    {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        );
      })}

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
    </div>
  );
};
