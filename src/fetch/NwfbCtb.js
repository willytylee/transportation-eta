import axios from "axios";
import { getClosestStr } from "../Utils";

export const fetchEtas = async ({ co, stopId, route, bound, dest }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${co}/${stopId}/${route}`
  );

  const routeDest = dest.zh;

  const destList = response.data.data.reduce((prev, curr) => {
    if (!prev.includes(curr.dest_tc)) {
      prev.push(curr.dest_tc);
    }
    return prev;
  }, []);

  const correctDest = getClosestStr(routeDest, destList);

  return response.data.data
    .filter(
      (e) =>
        e.eta !== null && bound?.includes(e.dir) && e.dest_tc === correctDest
    )
    .map((e) => {
      return {
        co,
        eta: e.eta,
        rmk_tc: e.rmk_tc,
      };
    });
};
