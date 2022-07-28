import axios from "axios";
import { getClosestStr } from "../../Utils";

export const fetchNwfbCtbEtas = async ({
  co,
  stopId,
  route,
  bound,
  dest,
  gtfsId,
}) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${co}/${stopId}/${route}`
  );

  const routeDest = dest.zh;

  const { data } = response.data;

  // Find the destination list if different eta using in same stop
  const destList = data.reduce((prev, curr) => {
    if (!prev.includes(curr.dest_tc)) {
      prev.push(curr.dest_tc);
    }
    return prev;
  }, []);

  // Find the correct destination by geting the closest destination string
  const correctDest = getClosestStr(routeDest, destList);

  return data
    .filter(
      (e) =>
        e.eta !== null && bound?.includes(e.dir) && e.dest_tc === correctDest
    )
    .map((e) => {
      return {
        co,
        eta: e.eta,
        rmk_tc: e.rmk_tc,
        gtfsId,
        stopId,
      };
    });
};
