import { sortEtaObj } from "../../Utils/Utils";
import { fetchGmbEtas } from "./Gmb";
import { fetchKmbEtas } from "./Kmb";
import { fetchMtrEtas } from "./Mtr";
import { fetchNlbEtas } from "./Nlb";
import { fetchNwfbCtbEtas } from "./NwfbCtb";
import { fetchLrtEtas } from "./Lrt";

export const fetchEtas = async ({
  error,
  bound,
  co,
  dest,
  gtfsId,
  route,
  serviceType,
  seq,
  stopId,
  stops,
  nlbId,
}) => {
  try {
    if (!error) {
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
                route,
                seq,
                stopId: _stopId,
              })
            );
          } else if (company_id === "nlb") {
            etas = etas.concat(
              await fetchNlbEtas({
                nlbId,
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
                bound,
              })
            );
          } else if (company_id === "lightRail") {
            etas = etas.concat(
              await fetchLrtEtas({
                route,
                stopId: _stopId,
                dest,
              })
            );
          }
        }
      }

      return sortEtaObj(etas);
    }
    return false;
  } catch (err) {
    return [];
  }
};
