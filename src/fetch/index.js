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
}) => {
  try {
    let _etas = [];

    for (const company_id of co) {
      if (company_id === "kmb") {
        _etas = _etas.concat(
          await kmbFetchEtas({
            bound: bound[company_id],
            route,
            seq,
            serviceType,
            stopId: stops[company_id][seq - 1],
          })
        );
      } else if (company_id === "nwfb") {
        _etas = _etas.concat(
          await nwfbFetchEtas({
            bound: bound[company_id],
            route,
            seq,
            serviceType,
            stopId: stops[company_id][seq - 1],
          })
        );
      } else if (company_id === "ctb") {
        _etas = _etas.concat(
          await ctbFetchEtas({
            bound: bound[company_id],
            route,
            seq,
            serviceType,
            stopId: stops[company_id][seq - 1],
          })
        );
      }
    }

    return sortEtaObject(_etas);
  } catch (err) {
    console.error(err);
    return [];
  }
};
