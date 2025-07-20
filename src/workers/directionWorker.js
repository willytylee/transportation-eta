// src/workers/worker.js
import { getDistance } from "geolib";
import { getFirstCoByRouteObj } from "../utils/Utils";

const routeRatio = 0.9; // 0 to 1, the larger, the route become a straight line from point to point, apply on multi-route only.
const maxCommonStopDistance = 100; // The maximum distance between common stops

const walkDistanceTimeRatio = 40; // The meter / minutes for calculate the walking time. The more the value, the faster you walk, 50 = 1000m / 20minutes
const mtrDistanceTimeRatio = 600;
const carDistanceTimeRatio = 200;
const displacementDistanceRatio = 0.75;
const minRouteDistance = 300;

self.onmessage = function handleMessage(e) {
  const { origins, destinations, routeList, gStopList } = e.data;

  const calculateTransportTimeAndDistance = ({
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
      return {
        time: Math.round(routeObj.jt * (transportDistance / fullRouteDistance)),
        distance: transportDistance,
      };
    } else if (routeObj.co[0] === "mtr") {
      return {
        time: getMTRTravelTime(transportDistance),
        distance: transportDistance,
      };
    }
    return {
      time: getCarTravelTime(transportDistance),
      distance: transportDistance,
    };
  };

  const getWalkTime = (meter) => Math.round(meter / walkDistanceTimeRatio);

  const result = [];
  const singleRouteSet = new Set(result.map((f) => f.route));

  if (origins && destinations) {
    // ===========================  Single Route  ===========================
    routeList?.forEach((routeObj) => {
      if (singleRouteSet.has(routeObj.route)) return;

      const company = getFirstCoByRouteObj(routeObj);

      // Find the stopId that the route included
      const matchedOriginStops = routeObj.stops[company].filter((f) =>
        Object.keys(origins).includes(f)
      );

      const matchedDestinationStops = routeObj.stops[company].filter((f) =>
        Object.keys(destinations).includes(f)
      );

      // If this route contain both orig stop Id and dest stop Id,
      // that mean the direction can be done in one route.
      if (
        matchedOriginStops?.length > 0 &&
        matchedDestinationStops?.length > 0
      ) {
        // There may have multi stops within the certain distance,
        // find the nearest stop in the route stop List
        const origStopId = matchedOriginStops.reduce((prev, curr) =>
          origins[prev] < origins[curr] ? prev : curr
        );
        const destStopId = matchedDestinationStops.reduce((prev, curr) =>
          destinations[prev] < destinations[curr] ? prev : curr
        );

        // Get the sequence of origStop, destStop
        const origStopSeq = routeObj.stops[company].indexOf(origStopId) + 1;
        const destStopSeq = routeObj.stops[company].indexOf(destStopId) + 1;

        const correctSeqOrder = origStopSeq < destStopSeq;

        if (!correctSeqOrder) return;

        const origWalkDistance = origins[origStopId];
        const destWalkDistance = destinations[destStopId];

        const origWalkTime = getWalkTime(origWalkDistance);
        const destWalkTime = getWalkTime(destWalkDistance);

        // Calcaulate transportTime
        const { time: transportTime } = calculateTransportTimeAndDistance({
          routeObj,
          company,
          startStopSeq: origStopSeq,
          endStopSeq: destStopSeq,
        });

        singleRouteSet.add(routeObj.route);
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
    });

    // ===========================  Connecting Route  ===========================

    const seenPairs = new Set();

    // Find routes containing any origin stop
    const origRoutes = routeList.filter((routeObj) => {
      // Find the stopId that the route included
      const company = getFirstCoByRouteObj(routeObj);
      const matchedOriginStops = routeObj.stops[company].filter((f) =>
        Object.keys(origins).includes(f)
      );

      return matchedOriginStops.some((_origin) =>
        routeObj.stops[company].includes(_origin)
      );
    });

    // Find routes containing any destination stop
    const destRoutes = routeList.filter((routeObj) => {
      const company = getFirstCoByRouteObj(routeObj);
      const matchedDestinationStops = routeObj.stops[company].filter((f) =>
        Object.keys(destinations).includes(f)
      );
      return matchedDestinationStops.some((dest) =>
        routeObj.stops[company].includes(dest)
      );
    });

    // Check for connected routes
    for (const origRoute of origRoutes) {
      // if single route has route, no need go for connected routes
      if (singleRouteSet.has(origRoute.route)) continue;

      const origCompany = getFirstCoByRouteObj(origRoute);
      const origRouteStops = origRoute.stops[origCompany];

      // Find matched origin stops
      const matchedOriginStops = Object.keys(origins).filter((_origin) =>
        origRouteStops.includes(_origin)
      );

      if (matchedOriginStops.length > 0) {
        // There may have multi stops within the certain distance,
        // find the nearest stop in the route stop List
        const origStopId = matchedOriginStops.reduce((prev, curr) =>
          origins[prev] < origins[curr] ? prev : curr
        );

        // Get the sequence of origStop, destStop and common Stop on both route
        // For calculate the correct order sequence between them
        const origStopSeq = origRouteStops.indexOf(origStopId) + 1;

        // Make sure the common point is after the start point and before the end point
        const origRouteStopsAfterStart = origRouteStops.slice(origStopSeq + 1);

        for (const destRoute of destRoutes) {
          // if single route has route, no need go for connected routes
          if (singleRouteSet.has(destRoute.route)) continue;

          if (origRoute.route === destRoute.route) continue; // Skip if same route

          // Create a unique key for the route pair
          const pairKey = `${origRoute.route}:${destRoute.route}`;
          if (seenPairs.has(pairKey)) continue;

          const destCompany = getFirstCoByRouteObj(destRoute);
          const destRouteStops = destRoute.stops[destCompany];
          // Find matched destination stops
          const matchedDestinationStops = Object.keys(destinations).filter(
            (dest) => destRouteStops.includes(dest)
          );

          if (matchedDestinationStops.length > 0) {
            // There may have multi stops within the certain distance,
            // find the nearest stop in the route stop List
            const destStopId = matchedDestinationStops.reduce((prev, curr) =>
              destinations[prev] < destinations[curr] ? prev : curr
            );

            // Get the sequence of origStop, destStop and common Stop on both route
            // For calculate the correct order sequence between them
            const destStopSeq = destRouteStops.indexOf(destStopId) + 1;

            // Make sure the common point is after the start point and before the end point
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

            if (!pair) continue; // Can't find any common stop

            const {
              _origStopId: origCommonStopId,
              origCommonStopSeq,
              _destStopId: destCommonStopId,
              destCommonStopSeq,
            } = pair;

            const correctSeqOrder =
              origStopSeq < origCommonStopSeq &&
              destCommonStopSeq < destStopSeq;

            if (!correctSeqOrder) continue;

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

            // Shouldn't bring you far away from destination
            const correctCommonStop =
              distanceBtwnOrigStopAndCommonStop <
                distanceBtwnOrigStopAndDestStop &&
              distanceBtwnCommonStopAndDestStop <
                distanceBtwnOrigStopAndDestStop &&
              distanceBtwnOrigStopAndDestStop /
                (distanceBtwnOrigStopAndCommonStop +
                  distanceBtwnCommonStopAndDestStop) >
                routeRatio;

            if (!correctCommonStop) continue;

            // The route can't be too short
            if (
              distanceBtwnOrigStopAndCommonStop < minRouteDistance ||
              distanceBtwnCommonStopAndDestStop < minRouteDistance
            ) {
              continue;
            }

            const origWalkDistance = origins[origStopId];
            const destWalkDistance = destinations[destStopId];

            const origWalkTime = getWalkTime(origWalkDistance);
            const destWalkTime = getWalkTime(destWalkDistance);

            const { time: origTransportTime, distance: origTransportDistance } =
              calculateTransportTimeAndDistance({
                routeObj: origRoute,
                company: origCompany,
                startStopSeq: origStopSeq,
                endStopSeq: origCommonStopSeq,
              });

            const { time: destTransportTime, distance: destTransportDistance } =
              calculateTransportTimeAndDistance({
                routeObj: destRoute,
                company: destCompany,
                startStopSeq: destCommonStopSeq,
                endStopSeq: destStopSeq,
              });

            // Prevent junk route / too many stops
            const cleanRoute =
              distanceBtwnOrigStopAndCommonStop / origTransportDistance >
                displacementDistanceRatio &&
              distanceBtwnCommonStopAndDestStop / destTransportDistance >
                displacementDistanceRatio;

            if (!cleanRoute) continue;

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
