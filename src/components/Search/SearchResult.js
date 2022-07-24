import { useState, useEffect, useMemo, useContext } from "react";
import { getPreciseDistance } from "geolib";
import { Card } from "@mui/material";
import { StopEta } from "./StopEta";
import { getLocalStorage } from "../../Utils";
import { AppContext } from "../../context/AppContext";
import { fetchEtas } from "../../fetch";

export const SearchResult = ({ route }) => {
  const [routeList, setRouteList] = useState([]);
  const [stopList, setStopList] = useState([]);
  const [closestStopId, setClosestStopId] = useState("");

  const [expandIdx, setExpandIdx] = useState(-1);
  const { dbVersion, location: currentLocation } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const handleCardOnClick = (i) => {
    setExpandIdx(i);
  };

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
              (e.co.includes("kmb") ||
                e.co.includes("nwfb") ||
                e.co.includes("ctb"))
            );
          })
          .sort((a, b) => a.serviceType - b.serviceType)
      );
    }
  }, [route]);

  useEffect(() => {
    setStopList([]);

    if (route && expandIdx !== -1) {
      const expandRoute = routeList[expandIdx];
      const companyId = expandRoute.co[0];
      const expandStopIdList = expandRoute.stops[companyId];

      setStopList(
        expandStopIdList.map((e) => {
          return { ...gStopList[e], stopId: e };
        })
      );
    }
  }, [expandIdx]);

  useEffect(() => {
    if (expandIdx !== -1) {
      const expandRoute = routeList[expandIdx];
      const companyId = expandRoute.co[0];
      const expandStopIdList = expandRoute.stops[companyId];

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
  }, [expandIdx, currentLocation.lat, currentLocation.lng]);

  return (
    <div className="searchResult">
      {routeList.map((e, i) => {
        return (
          <div key={i} onClick={() => handleCardOnClick(i)}>
            <Card className={"searchResultCard"} variant="outlined">
              <div
                className="routeTitle"
                style={
                  expandIdx === i ? { backgroundColor: "lightyellow" } : {}
                }
              >
                {e.orig.zh} → {e.dest.zh}{" "}
                <span className="special">
                  {e.serviceType !== "1" && "特別班次"}
                </span>
              </div>
            </Card>
          </div>
        );
      })}

      <Card>
        <table className="searchResultTable">
          <tbody>
            {routeList &&
              stopList &&
              expandIdx !== -1 &&
              stopList?.map((e, i) => {
                const isClosestStop = gStopList[closestStopId]?.name === e.name;
                return (
                  <StopEta
                    key={i}
                    seq={i + 1}
                    routeObj={routeList[expandIdx]}
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
