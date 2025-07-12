// src/workers/worker.js
import _ from "lodash";
import { getFirstCoByRouteObj } from "../Utils/Utils";

self.onmessage = function handleMessage(e) {
  const { routeKeyList, gRouteList, stopIdsNearby } = e.data;

  const filteredRouteObjList = [];

  // Find out the route which contains the near by Stops
  routeKeyList?.forEach((key) => {
    const routeData = { ...gRouteList[key] };
    const company = getFirstCoByRouteObj(routeData);
    const { stops } = routeData;

    const filitedStopId = stops[company].filter((f) =>
      Object.keys(stopIdsNearby).includes(f)
    );

    if (filitedStopId?.length > 0) {
      // There may have more than one stopIdsNearby in a route, find the nearest stop in the route stop List
      const _stopId = filitedStopId.reduce((prev, curr) =>
        stopIdsNearby[prev] < stopIdsNearby[curr] ? prev : curr
      );
      const origStopSeq = stops[company].findIndex((f) => f === _stopId) + 1;
      routeData.stopId = _stopId;
      routeData.seq = origStopSeq;

      routeData.distance = stopIdsNearby[_stopId];
      routeData.routeKey = key;

      filteredRouteObjList.push(routeData);
    }
  });

  const result = _(filteredRouteObjList)
    .groupBy((x) => x.stopId)
    .map((value, key) => ({
      stopId: key,
      routes: value,
    }))
    .value()
    .sort((a, b) => a.routes[0].distance - b.routes[0].distance);

  self.postMessage(result);
};
