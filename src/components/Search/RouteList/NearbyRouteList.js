import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { styled } from "@mui/material";
import { basicFiltering, getCoPriorityId, getCoIconByRouteObj } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { companyIconMap, primaryColor } from "../../../constants/Constants";
import { mtrIconColor } from "../../../constants/Mtr";
import { useLocation } from "../../../hooks/Location";
import { useStopIdsNearBy } from "../../../hooks/Stop";
import { Eta } from "./Eta";

export const NearbyRouteList = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const { route } = useContext(EtaContext);
  const navigate = useNavigate();
  const { location: currentLocation } = useLocation({ interval: 60000 });
  const { stopIdsNearby } = useStopIdsNearBy({
    maxDistance: 500,
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  const routeList =
    gRouteList &&
    Object.keys(gRouteList)
      .map((e) => {
        gRouteList[e].key = e;
        return gRouteList[e];
      })
      .filter((e) => basicFiltering(e))
      .filter((e) => (route ? route === e.route.substring(0, route.length) : true));

  const filteredRouteList = [];

  // Find out the route which contains the near by Stops
  routeList?.forEach((e) => {
    const company = getCoPriorityId(e);

    const filitedStopId = Object.values(e.stops[company]).filter((f) => Object.keys(stopIdsNearby).includes(f));

    if (filitedStopId?.length > 0) {
      // There may have more than one stopIdsNearby in a route, find the nearest stop in the route stop List
      const _stopId = filitedStopId.reduce((prev, curr) => (stopIdsNearby[prev] < stopIdsNearby[curr] ? prev : curr));
      e.nearbyOrigStopId = _stopId;
      e.nearbyOrigStopSeq = e.stops[company].findIndex((f) => f === _stopId) + 1;
      e.distance = stopIdsNearby[_stopId];
      filteredRouteList.push(e);
    }
  });

  const nearbyRouteList = _(filteredRouteList)
    .groupBy((x) => x.nearbyOrigStopId)
    .map((value, key) => ({
      stopId: key,
      routes: value,
    }))
    .value()
    .sort((a, b) => a.routes[0].distance - b.routes[0].distance);

  return (
    <>
      {nearbyRouteList?.length > 0 &&
        nearbyRouteList.map((e, i) => {
          const stop = gStopList[e.stopId];
          const name = stop.name.zh;
          const { lat, lng } = stop.location;
          return (
            <NearbyRouteListRoot key={i}>
              <div className="stop">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`} title={e.stopId}>
                  {name} - {e.routes[0].distance}米
                </a>
              </div>
              <div className="routes">
                {e.routes.map((routeObj, j) => (
                  <div key={j} className="routeItems" onClick={() => navigate("/search/" + routeObj.key, { replace: true })}>
                    <div className="transportIconWrapper">
                      <img className="transportIcon" src={companyIconMap[getCoIconByRouteObj(routeObj)]} alt="" />
                    </div>
                    <div className="route">{routeObj.route}</div>
                    <div className="nearStopDest">
                      <div>
                        <span className="dest">{routeObj.dest.zh}</span>
                        <span className="special"> {parseInt(routeObj.serviceType, 10) !== 1 && "特別班次"}</span>
                      </div>
                    </div>
                    <div className="eta">
                      <Eta seq={routeObj.nearbyOrigStopSeq} routeObj={routeObj} slice={1} />
                    </div>
                  </div>
                ))}
              </div>
            </NearbyRouteListRoot>
          );
        })}

      {currentLocation.lat === 0 && currentLocation.lng === 0 && <div className="emptyMsg">載入中...</div>}

      {currentLocation.lat !== 0 && currentLocation.lng !== 0 && nearbyRouteList?.length === 0 && <div className="emptyMsg">附近未有交通路線</div>}
    </>
  );
};

const NearbyRouteListRoot = styled("div")({
  display: "flex",
  padding: "4px",
  flexDirection: "column",
  ".stop": {
    backgroundColor: `${primaryColor}26`,
    padding: "4px 10px",
  },
  ".routes": {
    padding: "0 10px",
    ".routeItems": {
      display: "flex",
      alignItems: "center",
      padding: "4px 0",
      borderBottom: "1px solid lightgrey",
      ".transportIconWrapper": {
        width: "10%",
        display: "flex",
        ...mtrIconColor,
        ".transportIcon": {
          height: "18px",
        },
      },
      ".route": {
        fontWeight: "900",
        width: "12.5%",
      },
      ".nearStopDest": {
        width: "57.5%",
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
