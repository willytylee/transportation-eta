import { sortEtaObj } from "../../Utils";
import { fetchKmbEtas } from "./Kmb";
import { fetchNwfbCtbEtas } from "./NwfbCtb";

export const fetchEtas = async ({
  bound,
  co,
  dest,
  gtfsId,
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
              gtfsId,
              route,
              seq, // seq is not a must
              serviceType: serviceType ? serviceType : 1,
              stopId: stopId
                ? stopId
                : seq && stops[company_id]
                ? stops[company_id][seq - 1]
                : "",
            })
          );
        }
      } else if (company_id === "nwfb" || company_id === "ctb") {
        const _stopId = stopId
          ? stopId
          : seq && stops[company_id] && stops[company_id][seq - 1];
        if (_stopId) {
          etas = etas.concat(
            await fetchNwfbCtbEtas({
              bound: bound[company_id],
              co: company_id,
              dest,
              gtfsId,
              route,
              stopId: _stopId,
            })
          );
        }
      }
    }

    return sortEtaObj(etas);
  } catch (err) {
    // console.error(err);
    return [];
  }
};
