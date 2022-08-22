import { useContext, useMemo } from "react";
import _ from "lodash";
import { getPreciseDistance } from "geolib";
import { styled } from "@mui/material";
import { AppContext } from "../../../context/AppContext";
import {
  getCoByStopObj,
  basicFiltering,
  getCoPriorityId,
} from "../../../Utils";
import { DbContext } from "../../../context/DbContext";
import { companyColor, companyMap } from "../../../constants/Constants";
import { Eta } from "./Eta";

export const NearbyRouteList = ({ handleRouteListItemOnClick }) => {
  const { location: currentLocation } = useContext(AppContext),
    { gRouteList, gStopList, gStopMap } = useContext(DbContext);

  const stopIdsNearby = useMemo(
    // use useMemo prevent flicker on the list
    () =>
      Object.keys(gStopList)
        .map((e) => {
          const obj = gStopList[e];
          const distance = getPreciseDistance(
            { latitude: obj.location.lat, longitude: obj.location.lng },
            { latitude: currentLocation.lat, longitude: currentLocation.lng }
          );
          return { [e]: { distance, stopMap: gStopMap[e] } };
        })
        .filter((e) => {
          const value = Object.values(e)[0];
          return (
            value.distance < 500 &&
            (value.stopMap === undefined ||
              (value.stopMap // For those CTB/NWFB route's stopMap includes 'kmb', filter away. we need kmb stop only
                ? value.stopMap[0].includes("ctb") ||
                  value.stopMap[0].includes("nwfb")
                : true))
          );
        })
        .reduce(
          (prev, curr) => ({
            ...prev,
            [Object.keys(curr)]: Object.values(curr)[0].distance,
          }),
          {}
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const routeList = Object.keys(gRouteList)
    .map((e) => gRouteList[e])
    .filter((e) => basicFiltering(e));

  const routeListNearby = [];

  // // Find out the route which contains the near by Stops
  routeList.forEach((e) => {
    const company = getCoPriorityId(e);

    const filitedStopId = Object.values(e.stops[company]).filter((f) =>
      Object.keys(stopIdsNearby).includes(f)
    );

    if (filitedStopId?.length > 0) {
      // There may have more than one stopIdsNearby in a route, find the nearest stop in the route stop List
      const _stopId = filitedStopId.reduce((prev, curr) =>
        stopIdsNearby[prev] < stopIdsNearby[curr] ? prev : curr
      );
      e.nearbyStopId = _stopId;
      e.nearbyStopSeq = e.stops[company].findIndex((f) => f === _stopId) + 1;
      e.distance = stopIdsNearby[_stopId];
      routeListNearby.push(e);
    }
  });

  const nearbyRouteList = _(routeListNearby)
    .groupBy((x) => x.nearbyStopId)
    .map((value, key) => ({
      stopId: key,
      routes: value,
    }))
    .value()
    .sort((a, b) => a.routes[0].distance - b.routes[0].distance);

  return nearbyRouteList.length > 0 ? (
    nearbyRouteList.map((e, i) => {
      const stop = gStopList[e.stopId];
      const name = stop.name.zh;
      const { lat, lng } = stop.location;
      return (
        <NearbyRouteListRoot key={i}>
          <div className="stop">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
              title={e.stopId}
            >
              {name} - {e.routes[0].distance}米
            </a>
          </div>
          <div className="routes">
            {e.routes.map((routeObj, j) => (
              <div
                key={j}
                className="routeItems"
                onClick={() => handleRouteListItemOnClick(routeObj)}
              >
                <div className="company">
                  {getCoByStopObj(routeObj)
                    .map((companyId, k) => (
                      <span key={k} className={companyId}>
                        {companyMap[companyId]}
                      </span>
                    ))
                    .reduce((a, b) => [a, " + ", b])}
                </div>
                <div className="route">{routeObj.route}</div>
                <div className="nearStopDest">
                  <div>
                    <span className="dest">{routeObj.dest.zh}</span>
                    <span className="special">
                      {" "}
                      {parseInt(routeObj.serviceType, 10) !== 1 && "特別班次"}
                    </span>
                  </div>
                </div>
                <div className="eta">
                  <Eta routeObj={routeObj} />
                </div>
              </div>
            ))}
          </div>
        </NearbyRouteListRoot>
      );
    })
  ) : (
    <div className="emptyMsg">附近未有交通路線</div>
  );
};

const NearbyRouteListRoot = styled("div")({
  display: "flex",
  padding: "4px",
  flexDirection: "column",
  ".stop": {
    background: "#2f305c26",
    padding: "4px 10px",
  },
  ".routes": {
    padding: "0 10px",
    ".routeItems": {
      display: "flex",
      alignItems: "center",
      padding: "4px 0",
      borderBottom: "1px solid lightgrey",
      ".company": {
        ...companyColor,
        width: "22.5%",
      },
      ".route": {
        fontWeight: "900",
        letterSpacing: "-0.5px",
        width: "12.5%",
      },
      ".nearStopDest": {
        width: "60%",
        ".special": {
          fontSize: "10px",
        },
      },
      ".eta": {
        width: "20%",
        float: "left",
      },
    },
  },
});
