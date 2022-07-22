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
  const [winBound, setWinBound] = useState("");
  const [expandIndex, setExpandIndex] = useState(-1);
  const { dbVersion, location: currentLocation } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const handleCardOnClick = (i) => {
    setExpandIndex(i);
  };

  useEffect(() => {
    setStopList([]);
    setWinBound("");
    setExpandIndex(-1);

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
    setWinBound("");
    setStopList([]);

    if (route && expandIndex !== -1) {
      const expandRoute = routeList[expandIndex];
      const companyId = expandRoute.co[0];
      const expandStopIdList = expandRoute.stops[companyId];
      const routeBound = expandRoute.bound[companyId];

      setStopList(
        expandStopIdList.map((e) => {
          return { ...gStopList[e], stopId: e };
        })
      );

      // Due to the route got both bound (i.e. (IO / OI)),
      // we need to find the correct bound by fetch all the other stop,
      // which bound got the more number, who will be the bound
      if (routeBound.length === 2) {
        let promises = [];

        expandStopIdList.forEach((e) =>
          promises.push(fetchEtas({ ...expandRoute, stopId: e }))
        );

        Promise.all(promises).then((response) => {
          const boundCount = response.reduce(
            (prev, curr) => {
              if (curr.length > 0) {
                const { bound } = curr[0];
                return { ...prev, [bound]: prev[bound] + 1 };
              } else {
                return { ...prev };
              }
            },
            { I: 0, O: 0 }
          );

          setWinBound(
            Object.keys(boundCount).reduce((prev, curr) =>
              boundCount[prev] > boundCount[curr] ? prev : curr
            )
          );
        });
      }
    }
  }, [expandIndex]);

  useEffect(() => {
    if (expandIndex !== -1) {
      const expandRoute = routeList[expandIndex];
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
  }, [expandIndex, currentLocation.lat, currentLocation.lng]);

  return (
    <div className="searchResult">
      {routeList.map((e, i) => {
        return (
          <div key={i} onClick={() => handleCardOnClick(i)}>
            <Card className={"searchResultCard"} variant="outlined">
              <div
                className="routeTitle"
                style={
                  expandIndex === i ? { backgroundColor: "lightyellow" } : {}
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
              expandIndex !== -1 &&
              stopList?.map((e, i) => {
                const isClosestStop = gStopList[closestStopId]?.name === e.name;
                return (
                  <StopEta
                    key={i}
                    seq={i + 1} // TODO: seq = i + 1 not accurate
                    routeObj={routeList[expandIndex]}
                    stopObj={e}
                    isClosestStop={isClosestStop}
                    bound={winBound}
                  />
                );
              })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
