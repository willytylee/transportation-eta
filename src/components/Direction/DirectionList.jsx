import { useState, useContext, useEffect, useMemo } from "react";
import { styled } from "@mui/material";
import { getDistance } from "geolib";
import { DbContext } from "../../context/DbContext";
import { useLocationOnce } from "../../hooks/Location";
import { useStopIdsNearby } from "../../hooks/StopIdsNearBy";
import { basicFiltering, getFirstCoByRouteObj } from "../../Utils/Utils";
import { DirectionContext } from "../../context/DirectionContext";
import { DirectionItem } from "./DirectionItem";

export const DirectionList = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const {
    updateCurrRoute,
    origin,
    destination,
    sortingMethod,
    updateExpanded,
  } = useContext(DirectionContext);
  const [directionRouteList, setDirectionRouteList] = useState([]);
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

  const { location: currentLocation } = useLocationOnce();
  const { stopIdsNearby: origins } = useStopIdsNearby({
    maxDistance: 1000,
    lat: origin ? origin.location.lat : currentLocation.lat,
    lng: origin ? origin.location.lng : currentLocation.lng,
  });
  const { stopIdsNearby: destinations } = useStopIdsNearby({
    maxDistance: 1000,
    lat: destination?.location?.lat,
    lng: destination?.location?.lng,
  });
  const { stopIdsNearby: lessOrigins } = useStopIdsNearby({
    maxDistance: 300,
    lat: origin ? origin.location.lat : currentLocation.lat,
    lng: origin ? origin.location.lng : currentLocation.lng,
  });
  const { stopIdsNearby: lessDestinations } = useStopIdsNearby({
    maxDistance: 300,
    lat: destination?.location?.lat,
    lng: destination?.location?.lng,
  });

  const calculateTransportTime = ({
    routeObj,
    company,
    startStopSeq,
    endStopSeq,
  }) => {
    let fullRouteDistance = 0;
    let transportDistance = 0;
    for (let i = 0; i < routeObj.stops[company].length - 1; i += 1) {
      const stopId = routeObj.stops[company][i];
      const nextStopId = routeObj.stops[company][i + 1];
      const { location } = gStopList[stopId];
      const { location: nextLocation } = gStopList[nextStopId];

      const distance = getDistance(
        { latitude: location?.lat, longitude: location?.lng },
        { latitude: nextLocation?.lat, longitude: nextLocation?.lng }
      );

      fullRouteDistance += distance; // Add for every stop between

      if (i >= startStopSeq - 1 && i < endStopSeq - 1) {
        transportDistance += distance; // Add for only required stop between
      }
    }

    if (routeObj.jt !== null) {
      return Math.round(routeObj.jt * (transportDistance / fullRouteDistance));
    } 
      return null;
    
  };

  useEffect(() => {
    updateExpanded(false);
    // use useEffect prevent reload on setExpanded
    const getWalkTime = (meter) => Math.round(meter / 50);

    const result = [];
    const routeSet = new Set(result.map((e) => e.route));

    if (origins && destinations) {
      // ===========================  Single Route  ===========================
      routeList?.forEach((routeObj) => {
        const company = getFirstCoByRouteObj(routeObj);

        // Find the stopId that the route included
        const matchedOrigins = routeObj.stops[company].filter((f) =>
          Object.keys(origins).includes(f)
        );

        const matchedDestinations = routeObj.stops[company].filter((f) =>
          Object.keys(destinations).includes(f)
        );

        // If this route contain both orig stop Id and dest stop Id,
        // that mean the direction can be done in one route.
        if (matchedOrigins?.length > 0 && matchedDestinations?.length > 0) {
          // There may have more than one destinations in a route,
          // find the nearest stop in the route stop List
          const origStopId = matchedOrigins.reduce((prev, curr) =>
            origins[prev] < origins[curr] ? prev : curr
          );
          const destStopId = matchedDestinations.reduce((prev, curr) =>
            destinations[prev] < destinations[curr] ? prev : curr
          );

          // Get the sequence of origStop, destStop
          const origStopSeq =
            routeObj.stops[company].findIndex((f) => f === origStopId) + 1;
          const destStopSeq =
            routeObj.stops[company].findIndex((f) => f === destStopId) + 1;

          const origWalkDistance = origins[origStopId];
          const destWalkDistance = destinations[destStopId];

          const origWalkTime = getWalkTime(origWalkDistance);
          const destWalkTime = getWalkTime(destWalkDistance);

          // Calcaulate transportTime

          const transportTime = calculateTransportTime({
            routeObj,
            company,
            startStopSeq: origStopSeq,
            endStopSeq: destStopSeq,
          });

          if (origStopSeq < destStopSeq && !routeSet.has(routeObj.route)) {
            routeSet.add(routeObj.route);
            result.push({
              common: {},
              origin: {
                routeObj,
                stopId: origStopId,
                stopSeq: origStopSeq,
                walkDistance: origWalkDistance,
                walkTime: origWalkTime,
                transportTime,
              },
              destination: {
                routeObj: {},
                stopId: destStopId,
                stopSeq: destStopSeq,
                walkDistance: destWalkDistance,
                walkTime: destWalkTime,
                transportTime: 0,
              },
            });
          }
        }
      });

      // ===========================  Connecting Route  ===========================

      const seenPairs = new Set();

      // Find routes containing any origin stop
      const originRoutes = routeList.filter((routeObj) => {
        // Find the stopId that the route included
        const company = getFirstCoByRouteObj(routeObj);
        const matchedOrigins = routeObj.stops[company].filter((f) =>
          Object.keys(lessOrigins).includes(f)
        );

        return matchedOrigins.some((_origin) =>
          routeObj.stops[company].includes(_origin)
        );
      });

      // Find routes containing any destination stop
      const destinationRoutes = routeList.filter((routeObj) => {
        const company = getFirstCoByRouteObj(routeObj);
        const matchedDestinations = routeObj.stops[company].filter((f) =>
          Object.keys(lessDestinations).includes(f)
        );
        return matchedDestinations.some((dest) =>
          routeObj.stops[company].includes(dest)
        );
      });

      // Check for connected routes
      for (const originRoute of originRoutes) {
        const originCompany = getFirstCoByRouteObj(originRoute);
        for (const destRoute of destinationRoutes) {
          const destCompany = getFirstCoByRouteObj(destRoute);

          const originRouteStops = originRoute.stops[originCompany];
          const destRouteStops = destRoute.stops[destCompany];
          // Skip if same route
          if (originRoute.route === destRoute.route) continue;

          // Create a unique key for the route pair
          const pairKey = `${originRoute.route}:${destRoute.route}`;
          if (seenPairs.has(pairKey)) continue;

          // Find matched origin and destination stops
          const matchedOrigins = Object.keys(lessOrigins).filter((_origin) =>
            originRouteStops.includes(_origin)
          );
          const matchedDestinations = Object.keys(lessDestinations).filter(
            (dest) => destRouteStops.includes(dest)
          );

          if (matchedOrigins.length > 0 && matchedDestinations.length > 0) {
            // There may have more than one destinations in a route,
            // find the nearest stop in the route stop List
            const origStopId = matchedOrigins.reduce((prev, curr) =>
              lessOrigins[prev] < lessOrigins[curr] ? prev : curr
            );
            const destStopId = matchedDestinations.reduce((prev, curr) =>
              lessDestinations[prev] < lessDestinations[curr] ? prev : curr
            );

            // Get the sequence of origStop, destStop and common Stop on both route
            // For calculate the correct order sequence between them
            const origStopSeq =
              originRouteStops.findIndex((f) => f === origStopId) + 1;
            const destStopSeq =
              destRouteStops.findIndex((f) => f === destStopId) + 1;

            const originRouteStopsAfterStart = originRouteStops.slice(
              origStopSeq + 1
            );

            const commonStops = originRouteStopsAfterStart.filter((stop) =>
              destRouteStops.includes(stop)
            );

            const commonStopId = commonStops[commonStops.length - 1];

            // const commonStopId = originRouteStopsAfterStart.find((e) =>
            //   commonStops.includes(e)
            // );

            if (!commonStopId) {
              // CommonStopId not found, probably the common point is before the origin stop
              continue;
            }

            const commonStopSeqOrig =
              originRouteStops.findIndex((f) => f === commonStopId) + 1;
            const commonStopSeqDest =
              destRoute.stops[originCompany].findIndex(
                (f) => f === commonStopId
              ) + 1;

            // Get the distance to prevent the origin route bring you far away from destination
            const distanceBtwnOrigStopAndCommonStop = getDistance(
              {
                latitude: gStopList[origStopId].location.lat,
                longitude: gStopList[origStopId].location.lng,
              },
              {
                latitude: gStopList[commonStopId].location.lat,
                longitude: gStopList[commonStopId].location.lng,
              }
            );

            const distanceBtwnOrigStopAndDestStop = getDistance(
              {
                latitude: gStopList[origStopId].location.lat,
                longitude: gStopList[origStopId].location.lng,
              },
              {
                latitude: gStopList[destStopId].location.lat,
                longitude: gStopList[destStopId].location.lng,
              }
            );

            const origWalkDistance = lessOrigins[origStopId];
            const destWalkDistance = lessDestinations[destStopId];

            const origWalkTime = getWalkTime(origWalkDistance);
            const destWalkTime = getWalkTime(destWalkDistance);

            const origTransportTime = calculateTransportTime({
              routeObj: originRoute,
              company: originCompany,
              startStopSeq: origStopSeq,
              endStopSeq: commonStopSeqOrig,
            });

            const destTransportTime = calculateTransportTime({
              routeObj: destRoute,
              company: destCompany,
              startStopSeq: commonStopSeqDest,
              endStopSeq: destStopSeq,
            });

            const validCondition =
              origStopSeq < commonStopSeqOrig &&
              commonStopSeqDest < destStopSeq &&
              // Shouldn't bring you far away from destination
              distanceBtwnOrigStopAndCommonStop <
                distanceBtwnOrigStopAndDestStop;
            if (validCondition) {
              seenPairs.add(pairKey);
              result.push({
                common: {
                  stopId: commonStopId,
                  stopSeqOrig: commonStopSeqOrig,
                  stopSeqDest: commonStopSeqDest,
                },
                origin: {
                  routeObj: originRoute,
                  stopId: origStopId,
                  stopSeq: origStopSeq,
                  walkDistance: origWalkDistance,
                  walkTime: origWalkTime,
                  transportTime: origTransportTime,
                },
                destination: {
                  routeObj: destRoute,
                  stopId: destStopId,
                  stopSeq: destStopSeq,
                  walkDistance: destWalkDistance,
                  walkTime: destWalkTime,
                  transportTime: destTransportTime,
                },
              });
            }
          }
        }
      }
    }

    setDirectionRouteList(result);
  }, [origin, destination]);

  useEffect(() => {
    if (sortingMethod === "最短步行時間") {
      setSortedRouteList(
        directionRouteList.sort(
          (a, b) =>
            a.origin.walkTime +
            a.destination.walkTime -
            (b.origin.walkTime + b.destination.walkTime)
        )
      );
    } else if (sortingMethod === "最短交通時間") {
      setSortedRouteList(
        directionRouteList.sort(
          (a, b) =>
            a.origin.transportTime +
            a.destination.transportTime -
            (b.origin.transportTime + b.destination.transportTime)
        )
      );
    } else if (sortingMethod === "最短總時間") {
      setSortedRouteList(
        directionRouteList.sort(
          (a, b) =>
            a.origin.walkTime +
            a.origin.transportTime +
            a.destination.walkTime +
            a.destination.transportTime -
            (b.origin.walkTime +
              b.origin.transportTime +
              b.destination.walkTime +
              b.destination.transportTime)
        )
      );
    }
  }, [directionRouteList, sortingMethod]);

  // const groupedData = sortedRouteList.reduce((acc, item) => {
  //   const key = `${item.origin.stopId}|${item.destination.stopId}|${item.common.stopId}`;
  //   if (!acc[key]) {
  //     acc[key] = [];
  //   }
  //   acc[key].push(item);
  //   return acc;
  // }, {});

  // Convert to array format if needed
  // console.log(Object.values(groupedData));

  return (
    <DirectionListRoot>
      {origin &&
        destination &&
        (sortedRouteList?.length > 0 ? (
          sortedRouteList.map((e, i) => (
            <DirectionItem
              key={i}
              routeListItem={e}
              i={i}
              handleChange={handleChange}
              destination={destination}
            />
          ))
        ) : (
          <div className="emptyMsg">沒有路線</div>
        ))}

      {!origin && !destination ? (
        <div className="emptyMsg">載入中...</div>
      ) : !origin ? (
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
