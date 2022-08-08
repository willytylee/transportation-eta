import { sortEtaObj } from "../../Utils";
import { fetchKmbEtas } from "./Kmb";
import { fetchNwfbCtbEtas } from "./NwfbCtb";

export const fetchEtas = async ({
  bound,
  co,
  dest,
  orig,
  route,
  serviceType,
  seq,
  stopId,
  stops,
}) => {
  try {
    let etas = [];

    for (const company_id of co) {
      if (company_id === "kmb") {
        const _stopId = stopId
          ? stopId
          : seq && stops[company_id] && stops[company_id][seq - 1];
        if (_stopId) {
          etas = etas.concat(
            await fetchKmbEtas({
              bound: bound[company_id],
              route,
              seq,
              serviceType: serviceType ? serviceType : 1,
              stopId: _stopId,
            })
          );
        }
      } else if (company_id === "nwfb" || company_id === "ctb") {
        const _stopId = stopId
          ? stopId
          : seq && stops[company_id] && stops[company_id][seq - 1];

        const _bound =
          typeof bound === "string" || bound instanceof String
            ? bound
            : bound[company_id];

        if (_stopId) {
          etas = etas.concat(
            await fetchNwfbCtbEtas({
              bound: _bound,
              co: company_id,
              dest,
              orig,
              route,
              seq,
              stopId: _stopId,
            })
          );
        }
      }
    }

    return sortEtaObj(etas);
  } catch (err) {
    return [];
  }
};
