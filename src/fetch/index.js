import { sortEtaObject } from "../Utils";
import { fetchEtas as kmbFetchEtas } from "./Kmb";
import { fetchEtas as nwfbFetchEtas } from "./Nwfb";
import { fetchEtas as ctbFetchEtas } from "./Ctb";

export const fetchEtas = async ({
  route,
  stops,
  bound,
  seq,
  serviceType,
  co,
  stopId,
}) => {
  try {
    let etas = [];

    for (const company_id of co) {
      if (company_id === "kmb") {
        etas = etas.concat(
          await kmbFetchEtas({
            bound: bound[company_id],
            route,
            seq,
            serviceType: serviceType ? serviceType : 1,
            stopId: stopId ? stopId : seq ? stops[company_id][seq - 1] : "",
          })
        );
      } else if (company_id === "nwfb") {
        etas = etas.concat(
          await nwfbFetchEtas({
            bound: bound[company_id],
            route,
            serviceType: serviceType ? serviceType : 1,
            stopId: stopId ? stopId : seq ? stops[company_id][seq - 1] : "",
          })
        );
      } else if (company_id === "ctb") {
        etas = etas.concat(
          await ctbFetchEtas({
            bound: bound[company_id],
            route,
            serviceType: serviceType ? serviceType : 1,
            stopId: stopId ? stopId : seq ? stops[company_id][seq - 1] : "",
          })
        );
      }
    }

    return sortEtaObject(etas);
  } catch (err) {
    console.error(err);
    return [];
  }
};
