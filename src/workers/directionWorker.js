// src/workers/worker.js
import { getDistance } from "geolib";
import { getFirstCoByRouteObj } from "../Utils/Utils";

const routeRatio = 0.9; // 0 to 1, the larger, the route become a straight line from point to point, apply on multi-route only.
const maxCommonStopDistance = 150; // The maximum distance between common stops
const walkDistanceTimeRatio = 40; // The meter / minutes for calculate the walking time. The more the value, the faster you walk, 50 = 1000m / 20minutes
const mtrDistanceTimeRatio = 600;
const carDistanceTimeRatio = 200;

self.onmessage = function handleMessage(e) {
  const { origins, destinations, routeList, gStopList } = e.data;

  const calculateTransportTime = ({
    routeObj,
    company,
    startStopSeq,
    endStopSeq,
  }) => {
    let fullRouteDistance = 0;
    let transportDistance = 0;

    const getMTRTravelTime = (meter) =>
      Math.round(meter / mtrDistanceTimeRatio);
    const getCarTravelTime = (meter) =>
      Math.round(meter / carDistanceTimeRatio);

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
    } else if (routeObj.co[0] === "mtr") {
      return getMTRTravelTime(transportDistance);
    }
    return getCarTravelTime(transportDistance);
  };

  const getWalkTime = (meter) => Math.round(meter / walkDistanceTimeRatio);

  const result = [];
  const routeSet = new Set(result.map((f) => f.route));

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
        // There may have multi stops within the certain distance,
        // find the nearest stop in the route stop List
        const origStopId = matchedOrigins.reduce((prev, curr) =>
          origins[prev] < origins[curr] ? prev : curr
        );
        const destStopId = matchedDestinations.reduce((prev, curr) =>
          destinations[prev] < destinations[curr] ? prev : curr
        );

        // Get the sequence of origStop, destStop
        const origStopSeq = routeObj.stops[company].indexOf(origStopId) + 1;
        const destStopSeq = routeObj.stops[company].indexOf(destStopId) + 1;

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
            origin: {
              routeObj,
              stopId: origStopId,
              stopSeq: origStopSeq,
              commonStopId: "",
              commonStopSeq: "",
              walkDistance: origWalkDistance,
              walkTime: origWalkTime,
              transportTime,
            },
            destination: {
              routeObj: {},
              stopId: destStopId,
              stopSeq: destStopSeq,
              commonStopId: "",
              commonStopSeq: "",
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
    const origRoutes = routeList.filter((routeObj) => {
      // Find the stopId that the route included
      const company = getFirstCoByRouteObj(routeObj);
      const matchedOrigins = routeObj.stops[company].filter((f) =>
        Object.keys(origins).includes(f)
      );

      return matchedOrigins.some((_origin) =>
        routeObj.stops[company].includes(_origin)
      );
    });

    // Find routes containing any destination stop
    const destRoutes = routeList.filter((routeObj) => {
      const company = getFirstCoByRouteObj(routeObj);
      const matchedDestinations = routeObj.stops[company].filter((f) =>
        Object.keys(destinations).includes(f)
      );
      return matchedDestinations.some((dest) =>
        routeObj.stops[company].includes(dest)
      );
    });

    // Check for connected routes
    for (const origRoute of origRoutes) {
      const origCompany = getFirstCoByRouteObj(origRoute);
      for (const destRoute of destRoutes) {
        const destCompany = getFirstCoByRouteObj(destRoute);

        const origRouteStops = origRoute.stops[origCompany];
        const destRouteStops = destRoute.stops[destCompany];
        // Skip if same route
        if (origRoute.route === destRoute.route) continue;

        // Create a unique key for the route pair
        const pairKey = `${origRoute.route}:${destRoute.route}`;
        if (seenPairs.has(pairKey)) continue;

        // Find matched origin and destination stops
        const matchedOrigins = Object.keys(origins).filter((_origin) =>
          origRouteStops.includes(_origin)
        );
        const matchedDestinations = Object.keys(destinations).filter((dest) =>
          destRouteStops.includes(dest)
        );

        if (matchedOrigins.length > 0 && matchedDestinations.length > 0) {
          // There may have multi stops within the certain distance,
          // find the nearest stop in the route stop List
          const origStopId = matchedOrigins.reduce((prev, curr) =>
            origins[prev] < origins[curr] ? prev : curr
          );
          const destStopId = matchedDestinations.reduce((prev, curr) =>
            destinations[prev] < destinations[curr] ? prev : curr
          );

          // Get the sequence of origStop, destStop and common Stop on both route
          // For calculate the correct order sequence between them
          const origStopSeq = origRouteStops.indexOf(origStopId) + 1;
          const destStopSeq = destRouteStops.indexOf(destStopId) + 1;

          // Make sure the common point is after the start point and before the end point
          const origRouteStopsAfterStart = origRouteStops.slice(
            origStopSeq + 1
          );
          const destRouteStopsBeforeEnd = destRouteStops.slice(
            0,
            destStopSeq + 1
          );

          let pair = null;
          origRouteStopsAfterStart.some((_origStopId) =>
            destRouteStopsBeforeEnd.some((_destStopId) => {
              const distanceBtwnTwoCommonStop = getDistance(
                {
                  latitude: gStopList[_origStopId].location.lat,
                  longitude: gStopList[_origStopId].location.lng,
                },
                {
                  latitude: gStopList[_destStopId].location.lat,
                  longitude: gStopList[_destStopId].location.lng,
                }
              );

              if (distanceBtwnTwoCommonStop < maxCommonStopDistance) {
                const origCommonStopSeq =
                  origRouteStops.indexOf(_origStopId) + 1;
                const destCommonStopSeq =
                  destRouteStops.indexOf(_destStopId) + 1;

                pair = {
                  _origStopId,
                  origCommonStopSeq,
                  _destStopId,
                  destCommonStopSeq,
                };
                return true;
              }
              return false;
            })
          );

          if (!pair) {
            continue;
          }

          const {
            _origStopId: origCommonStopId,
            origCommonStopSeq,
            _destStopId: destCommonStopId,
            destCommonStopSeq,
          } = pair;

          // Get the distance to prevent the origin route bring you far away from destination
          const distanceBtwnOrigStopAndCommonStop = getDistance(
            {
              latitude: gStopList[origStopId].location.lat,
              longitude: gStopList[origStopId].location.lng,
            },
            {
              latitude: gStopList[origCommonStopId].location.lat,
              longitude: gStopList[origCommonStopId].location.lng,
            }
          );

          const distanceBtwnCommonStopAndDestStop = getDistance(
            {
              latitude: gStopList[destCommonStopId].location.lat,
              longitude: gStopList[destCommonStopId].location.lng,
            },
            {
              latitude: gStopList[destStopId].location.lat,
              longitude: gStopList[destStopId].location.lng,
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

          const origWalkDistance = origins[origStopId];
          const destWalkDistance = destinations[destStopId];

          const origWalkTime = getWalkTime(origWalkDistance);
          const destWalkTime = getWalkTime(destWalkDistance);

          const origTransportTime = calculateTransportTime({
            routeObj: origRoute,
            company: origCompany,
            startStopSeq: origStopSeq,
            endStopSeq: origCommonStopSeq,
          });

          const destTransportTime = calculateTransportTime({
            routeObj: destRoute,
            company: destCompany,
            startStopSeq: destCommonStopSeq,
            endStopSeq: destStopSeq,
          });

          const validCondition =
            origStopSeq < origCommonStopSeq &&
            destCommonStopSeq < destStopSeq &&
            // Shouldn't bring you far away from destination
            distanceBtwnOrigStopAndCommonStop <
              distanceBtwnOrigStopAndDestStop &&
            distanceBtwnCommonStopAndDestStop <
              distanceBtwnOrigStopAndDestStop &&
            distanceBtwnOrigStopAndDestStop /
              (distanceBtwnOrigStopAndCommonStop +
                distanceBtwnCommonStopAndDestStop) >
              routeRatio;

          if (validCondition) {
            seenPairs.add(pairKey);
            result.push({
              origin: {
                routeObj: origRoute,
                stopId: origStopId,
                stopSeq: origStopSeq,
                commonStopId: origCommonStopId,
                commonStopSeq: origCommonStopSeq,
                walkDistance: origWalkDistance,
                walkTime: origWalkTime,
                transportTime: origTransportTime,
              },
              destination: {
                routeObj: destRoute,
                stopId: destStopId,
                stopSeq: destStopSeq,
                commonStopId: destCommonStopId,
                commonStopSeq: destCommonStopSeq,
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
  self.postMessage(result);
};
