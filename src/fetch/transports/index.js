import { sortEtaObj } from "../../Utils";
import { fetchEtas as kmbFetchEtas } from "./Kmb";
import { fetchEtas as nwfbCtbFetchEtas } from "./NwfbCtb";

export const fetchEtas = async ({
  route,
  stops,
  bound,
  seq,
  serviceType,
  co,
  stopId,
  dest,
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
      } else if (company_id === "nwfb" || company_id === "ctb") {
        etas = etas.concat(
          await nwfbCtbFetchEtas({
            bound: bound[company_id],
            co: company_id,
            route,
            stopId: stopId ? stopId : seq ? stops[company_id][seq - 1] : "",
            dest,
          })
        );
      }
    }

    return sortEtaObj(etas);
  } catch (err) {
    console.error(err);
    return [];
  }
};
