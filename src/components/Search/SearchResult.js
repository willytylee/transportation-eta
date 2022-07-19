import React from "react";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import { StopEta } from "./StopEta";
import { fetchEtas } from "../../fetch";

export const SearchResult = (props) => {
  const { route, expandItem, setExpandItem, gRouteList, gStopList } = props;
  const [routeList, setRouteList] = useState([]);
  const [stopList, setStopList] = useState([]);

  const handleCardOnClick = (i) => {
    setExpandItem(i);
  };

  useEffect(() => {
    if (route) {
      const _routeList = Object.keys(gRouteList)
        .map((item) => gRouteList[item])
        .filter(
          (item) =>
            item.route == route &&
            (item.co.includes("kmb") ||
              item.co.includes("nwfb") ||
              item.co.includes("ctb"))
        )
        .sort((a, b) => a.serviceType - b.serviceType);
      setRouteList(_routeList);

      console.log(_routeList);

      if (expandItem != null) {
        const _stopList = _routeList.map((route) => {
          if (route.co.includes("kmb")) {
            // kmb is the priority
            return route.stops["kmb"].map((item) => {
              return Object.assign(
                {
                  bound: route.bound["kmb"],
                  co: "kmb",
                  serviceType: route.serviceType,
                  stop: item,
                },
                gStopList[item]
              );
            });
          } else if (route.co.includes("nwfb") || route.co.includes("ctb")) {
            return route.stops[route.co[0]].map((item) => {
              return Object.assign(
                {
                  bound: route.bound[route.co[0]],
                  co: route.co[0],
                  serviceType: route.serviceType,
                  stop: item,
                },
                gStopList[item]
              );
            });
          }
        });
        setStopList(_stopList);
      }
    } else {
      setRouteList([]);
      setStopList([]);
    }
  }, [route, expandItem]);

  return (
    <div className="searchResult">
      {routeList.map((item, i) => {
        return (
          <div key={i} onClick={() => handleCardOnClick(i)}>
            <Card className={"searchResultCard"} variant="outlined">
              <div
                className="routeTitle"
                style={expandItem === i ? { backgroundColor: "lightgrey" } : {}}
              >
                {item.orig.zh} - {item.dest.zh}{" "}
                <span className="special">
                  {item.serviceType !== "1" && "特別班次"}
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
              expandItem != null &&
              stopList[expandItem]?.map((item, i) => {
                const { lat, long } = item.location;
                const { name } = item;
                const latLng = [lat, long];
                return (
                  <StopEta
                    key={i}
                    seq={i + 1}
                    co={item.co}
                    stopId={item.stop}
                    route={route}
                    stopName={name.zh}
                    latLng={latLng}
                    bound={item.bound}
                    serviceType={item.serviceType}
                  />
                );
              })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
