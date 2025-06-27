import { useState, useContext, useEffect, useMemo } from "react";
import { styled } from "@mui/material";
import { getPreciseDistance } from "geolib";
import { DbContext } from "../../context/DbContext";
import { useLocationOnce } from "../../hooks/Location";
import { useStopIdsNearBy } from "../../hooks/Stop";
import { basicFiltering, getFirstCoByRouteObj } from "../../Utils/Utils";
import { DirectionContext } from "../../context/DirectionContext";
import { DirectionItem } from "./DirectionItem";

export const DirectionList = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const {
    updateCurrRoute,
    origination,
    destination,
    expanded,
    sortingMethod,
    updateExpanded,
  } = useContext(DirectionContext);
  const [nearbyRouteList, setNearbyRouteList] = useState([]);
  const [sortedRouteList, setSortedRouteList] = useState([]);

  const routeList = useMemo(
    () =>
      gRouteList &&
      Object.keys(gRouteList)
        .map((e) => {
          gRouteList[e].key = e;
          return gRouteList[e];
        })
        .filter((e) => basicFiltering(e)),
    []
  );

  const handleChange = (panel, currRoute) => (event, isExpanded) => {
    updateExpanded(isExpanded ? panel : false);
    updateCurrRoute(currRoute);
  };

  // eslint-disable-next-line no-unused-vars
  const { location: currentLocation } = useLocationOnce();
  const { stopIdsNearby: origStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 1200,
    lat: origination ? origination.location.lat : currentLocation.lat,
    lng: origination ? origination.location.lng : currentLocation.lng,
  });
  const { stopIdsNearby: destStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 1200,
    lat: destination?.location?.lat,
    lng: destination?.location?.lng,
  });

  useEffect(() => {
    updateExpanded(false);
    // use useEffect prevent reload on setExpanded
    const getWalkTime = (meter) => Math.round(meter / 50);

    const filteredRouteList = [];

    origStopIdsNearby &&
      destStopIdsNearby &&
      routeList?.forEach((e) => {
        const company = getFirstCoByRouteObj(e);

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

    setNearbyRouteList(
      filteredRouteList.map((e) => {
        const company = getFirstCoByRouteObj(e);

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
          transportTime:
            e.jt !== null
              ? Math.round(
                  e.jt * (actualTransportDistance / totalTransportDistance) +
                    (e.nearbyDestStopSeq - e.nearbyOrigStopSeq) // Topup for extra time in each stop
                )
              : null,
        };
      })
    );
  }, [origination, destination]);

  useEffect(() => {
    if (sortingMethod === "最短步行時間") {
      setSortedRouteList(
        nearbyRouteList.sort(
          (a, b) =>
            a.origWalkTime + a.destWalkTime - (b.origWalkTime + b.destWalkTime)
        )
      );
    } else if (sortingMethod === "最短交通時間") {
      setSortedRouteList(
        nearbyRouteList.sort((a, b) => a.transportTime - b.transportTime)
      );
    } else {
      setSortedRouteList(
        nearbyRouteList.sort(
          (a, b) =>
            a.origWalkTime +
            a.transportTime +
            a.destWalkTime -
            (b.origWalkTime + b.transportTime + b.destWalkTime)
        )
      );
    }
  }, [nearbyRouteList, sortingMethod]);

  return (
    <DirectionListRoot>
      {origination &&
        destination &&
        (sortedRouteList?.length > 0 ? (
          sortedRouteList.map((e, i) => (
            <DirectionItem
              key={i}
              e={e}
              i={i}
              handleChange={handleChange}
              destination={destination}
              expanded={expanded}
            />
          ))
        ) : (
          <div className="emptyMsg">沒有路線</div>
        ))}

      {!origination && !destination ? (
        <div className="emptyMsg">載入中...</div>
      ) : !origination ? (
        <div className="emptyMsg">請輸入起點</div>
      ) : (
        !destination && <div className="emptyMsg">請輸入目的地</div>
      )}
    </DirectionListRoot>
  );
};

const DirectionListRoot = styled("div")({
  display: "flex",
  flex: "5",
  flexDirection: "column",
  overflow: "auto",
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
});
