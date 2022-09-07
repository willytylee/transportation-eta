import { useState, useContext } from "react";
import { styled } from "@mui/material";
import { getPreciseDistance } from "geolib";
import { useStopIdsNearBy } from "../hooks/Stop";
import { DbContext } from "../context/DbContext";
import { basicFiltering, getCoPriorityId } from "../Utils/Utils";
import { useLocation } from "../hooks/Location";
import { SearchBar } from "../components/Direction/SearchBar";
import { DirectionItem } from "../components/Direction/DirectionItem";

export const Direction = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const [destLocation, setDestLocation] = useState({});

  const { location: currentLocation } = useLocation({ time: 60000 });
  const { stopIdsNearby: origStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 600,
    // lat: currentLocation.lat,
    // lng: currentLocation.lng,
    lat: 22.325945173233077,
    lng: 114.20357432861586,
  });
  const { stopIdsNearby: destStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 600,
    lat: destLocation?.lat,
    lng: destLocation?.lng,
  });

  const getWalkTime = (meter) => Math.round(meter / 40);

  const routeList =
    gRouteList &&
    Object.keys(gRouteList)
      .map((e) => gRouteList[e])
      .filter((e) => basicFiltering(e));

  const filteredRouteList = [];

  origStopIdsNearby &&
    destStopIdsNearby &&
    routeList?.forEach((e) => {
      const company = getCoPriorityId(e);

      const filitedOrigStopId = Object.values(e.stops[company]).filter((f) =>
        Object.keys(origStopIdsNearby).includes(f)
      );

      const filitedDestStopId = Object.values(e.stops[company]).filter((f) =>
        Object.keys(destStopIdsNearby).includes(f)
      );

      if (filitedOrigStopId?.length > 0 && filitedDestStopId?.length > 0) {
        // There may have more than one destStopIdsNearby in a route, find the nearest stop in the route stop List
        const _origStopId = filitedOrigStopId.reduce((prev, curr) =>
          origStopIdsNearby[prev] < origStopIdsNearby[curr] ? prev : curr
        );

        const _destStopId = filitedDestStopId.reduce((prev, curr) =>
          destStopIdsNearby[prev] < destStopIdsNearby[curr] ? prev : curr
        );

        e.nearbyOrigStopId = _origStopId;
        e.nearbyDestStopId = _destStopId;

        e.nearbyOrigStopSeq =
          e.stops[company].findIndex((f) => f === _origStopId) + 1;
        e.nearbyDestStopSeq =
          e.stops[company].findIndex((f) => f === _destStopId) + 1;

        e.origWalkDistance = origStopIdsNearby[_origStopId];
        e.destWalkDistance = destStopIdsNearby[_destStopId];

        let duplicate = false;
        filteredRouteList.forEach((f) => {
          if (e.route === f.route) {
            duplicate = true;
          }
        });

        if (e.nearbyOrigStopSeq < e.nearbyDestStopSeq && !duplicate) {
          filteredRouteList.push(e);
        }
      }
    });

  const nearbyRouteList = filteredRouteList.map((e, j) => {
    const company = getCoPriorityId(e);

    let totalTransportDistance = 0;
    let actualTransportDistance = 0;
    for (let i = 0; i < e?.stops[company].length - 1; i += 1) {
      const stopId = e?.stops[company][i];
      const nextStopId = e?.stops[company][i + 1];
      const { location } = gStopList[stopId];
      const { location: nextLocation } = gStopList[nextStopId];

      const distance = getPreciseDistance(
        { latitude: location?.lat, longitude: location?.lng },
        { latitude: nextLocation?.lat, longitude: nextLocation?.lng }
      );

      totalTransportDistance += distance;

      if (i >= e.nearbyOrigStopSeq - 1 && i < e.nearbyDestStopSeq - 1) {
        actualTransportDistance += distance;
      }
    }

    return {
      ...e,
      origWalkTime: getWalkTime(e.origWalkDistance),
      destWalkTime: getWalkTime(e.destWalkDistance),
      transportTime: Math.round(
        e.jt * (actualTransportDistance / totalTransportDistance)
      ),
    };
  });

  const sortedRouteList = nearbyRouteList.sort(
    (a, b) =>
      a.origWalkTime +
      a.transportTime +
      a.destWalkTime -
      (b.origWalkTime + b.transportTime + b.destWalkTime)
  );

  return (
    <DirectionRoot>
      <SearchBar setDestLocation={setDestLocation} />
      <div className="routeList">
        {sortedRouteList?.length > 0 &&
          sortedRouteList.map((e, i) => <DirectionItem key={i} e={e} />)}
      </div>
    </DirectionRoot>
  );
};

const DirectionRoot = styled("div")({
  fontSize: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  height: "100%",

  ".routeList": {
    overflow: "auto",
  },
});
