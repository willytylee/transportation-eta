import { useState, useEffect, useContext, useMemo } from "react";
import { Card } from "@mui/material";
import { getLocalStorage, mergeMissingStops } from "../../Utils";
import { companyMap } from "../../constants/Bus";
import { AppContext } from "../../context/AppContext";

export const RouteList = ({ route }) => {
  const [routeList, setRouteList] = useState([]);
  const { dbVersion, updateCurrRoute, currRoute } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const gStopMap = useMemo(() => {
    return getLocalStorage("stopMap");
  }, [dbVersion]);

  const handleCardOnClick = (i) => {
    const expandRoute = routeList[i];
    updateCurrRoute(expandRoute);
  };

  // When the route number is changed, update RouteList
  useEffect(() => {
    if (route) {
      const _routeList = Object.keys(gRouteList)
        .map((e) => gRouteList[e])
        .filter((e) => {
          return (
            e.route === route &&
            (e.co.includes("kmb") ||
              e.co.includes("nwfb") ||
              e.co.includes("ctb"))
            // &&
            // Take kmb as base, if company include kmb, stoplist must have kmb to pass.
            // If company have no kmb, just let it pass.
            // (e.co.includes("kmb") ? Object.keys(e.stops).includes("kmb") : true)
          );
        })
        .sort(
          (a, b) => parseInt(a.serviceType, 10) - parseInt(b.serviceType, 10)
        );

      // _routeList.map((e) => {
      //   if (e.co.includes("nwfb") && !Object.keys(e.stops).includes("nwfb")) {
      //     const nwfbStopList = e.stops.kmb.map((e) => {
      //       if (gStopMap[e]) {
      //         return gStopMap[e][0][1];
      //       }
      //       return "";
      //     });
      //     const obj = e;
      //     obj.stops = { ...e.stops, nwfb: nwfbStopList };
      //     return obj;
      //   } else if (
      //     e.co.includes("kmb") &&
      //     !Object.keys(e.stops).includes("kmb")
      //   ) {
      //     const kmbStopList = e.stops.nwfb.map((e) => {
      //       if (gStopMap[e]) {
      //         return gStopMap[e][0][1];
      //       }
      //       return "";
      //     });
      //     const obj = e;
      //     obj.stops = { ...e.stops, kmb: kmbStopList };
      //     return obj;
      //   }
      //   return e;
      // });

      setRouteList(_routeList);
    } else {
      setRouteList([]);
      updateCurrRoute({});
    }
  }, [route]);

  console.log(routeList);
  return (
    <>
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
                  {e.gtfsId}
                  <br />
                  {e.co.map((e) => companyMap[e]).join("+")}{" "}
                </div>
                <div className="origDest">
                  {e.orig.zh} → <span className="dest">{e.dest.zh}</span>{" "}
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
    </>
  );
};
