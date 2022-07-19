import React from "react";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import { StopEta } from "./StopEta";

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
        .map((e) => gRouteList[e])
        .filter(
          (e) =>
            e.route == route &&
            (e.co.includes("kmb") ||
              e.co.includes("nwfb") ||
              e.co.includes("ctb"))
        )
        .sort((a, b) => a.serviceType - b.serviceType);
      setRouteList(_routeList);
    } else {
      setRouteList([]);
      setStopList([]);
    }
  }, [route]);

  useEffect(() => {
    if (route && expandItem != null) {
      const _stopList = routeList.map((route) => {
        return route.stops[route.co[0]].map((e) => {
          return gStopList[e];
        });
      });
      setStopList(_stopList);
    } else {
      setRouteList([]);
      setStopList([]);
    }
  }, [expandItem]);

  return (
    <div className="searchResult">
      {routeList.map((e, i) => {
        return (
          <div key={i} onClick={() => handleCardOnClick(i)}>
            <Card className={"searchResultCard"} variant="outlined">
              <div
                className="routeTitle"
                style={expandItem === i ? { backgroundColor: "lightgrey" } : {}}
              >
                {e.orig.zh} - {e.dest.zh}{" "}
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
              expandItem != null &&
              stopList[expandItem]?.map((e, i) => {
                const { lat, long } = e.location;
                const { name } = e;
                const latLng = [lat, long];
                return (
                  <StopEta
                    key={i}
                    seq={i + 1} // TODO: seq = i + 1 not accurate
                    routeObj={routeList[expandItem]}
                    stopName={name.zh}
                    latLng={latLng}
                  />
                );
              })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};