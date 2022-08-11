import { sortEtaObj } from "../../Utils";
import { fetchGmbEtas } from "./Gmb";
import { fetchKmbEtas } from "./Kmb";
import { fetchMtrEtas } from "./Mtr";
import { fetchNwfbCtbEtas } from "./NwfbCtb";

export const fetchEtas = async ({
  bound,
  co,
  dest,
  gtfsId,
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
      const _stopId = stopId
        ? stopId
        : seq && stops[company_id] && stops[company_id][seq - 1];

      if (_stopId) {
        if (company_id === "kmb") {
          etas = etas.concat(
            await fetchKmbEtas({
              bound: bound[company_id],
              route,
              seq,
              serviceType: serviceType ? serviceType : 1,
              stopId: _stopId,
            })
          );
        } else if (company_id === "nwfb" || company_id === "ctb") {
          const _bound =
            typeof bound === "string" || bound instanceof String
              ? bound
              : bound[company_id];

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
        } else if (company_id === "gmb") {
          etas = etas.concat(
            await fetchGmbEtas({
              gtfsId,
              seq,
              route,
              stopId: _stopId,
            })
          );
        } else if (company_id === "mtr") {
          etas = etas.concat(
            await fetchMtrEtas({
              route,
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
