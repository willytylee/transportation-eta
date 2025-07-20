import { fetchEtas } from "../fetch/transports";
import { getFirstCoByRouteObj } from "./Utils";

export const buildRouteObjForEta = async (gStopList, gRouteList, category) => {
  const allPromises = [];

  for (let i = 0; i < category.length; i += 1) {
    // category = bookmark data
    // category only accept 3 params
    // routeKey and seq REQUIRED in category, stopId for cross check.
    const { routeKey, seq, stopId } = category[i];

    if (routeKey) {
      const routeData = gRouteList[routeKey];
      const co = getFirstCoByRouteObj(routeData);

      let routeObj;

      if (!seq || (stopId && routeData.stops[co][seq - 1] !== stopId)) {
        // Check if the seq and the stopId are matched,
        // If not match, it means the official database has been changed, User needs to update the bookmark.
        // * Only Bookmark will pass the seq and stopId for checking
        routeObj = { error: true };
      } else if (co === "mtr") {
        // Fetch MTR eta needs stopId and custom bound format (string)
        routeObj = { ...routeData, seq, bound: routeData.bound.mtr };
      } else {
        routeObj = routeData;
      }

      const promise = fetchEtas({
        ...routeObj,
        targetSeq: parseInt(seq, 10),
      });
      allPromises.push(promise);
    } else {
      const promise = fetchEtas({ error: true });
      allPromises.push(promise);
    }
  }

  const categoryEtas = await Promise.all(allPromises);

  return categoryEtas.map((e, i) => {
    const { routeKey, seq, stopId } = category[i];

    if (routeKey) {
      const routeData = gRouteList[routeKey];
      const co = getFirstCoByRouteObj(routeData);
      const { route, stops } = routeData;
      const _stopId = seq && stops[co] ? stops[co][seq - 1] : stopId;
      const stop = gStopList[_stopId];
      const { location } = stop;
      const stopName = stop.name.zh;

      return {
        etas: e,
        route,
        stopName,
        location,
        stopId: _stopId,
        co,
        routeKey,
      };
    }

    const { route, co } = category[i];
    return {
      etas: e,
      stopName: gStopList[stopId].name.zh,
      location,
      stopId,
      route,
      co,
    };
  });
};
