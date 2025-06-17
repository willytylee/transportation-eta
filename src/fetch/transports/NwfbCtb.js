import axios from "axios";
import { findNearestNumber } from "../../Utils/Utils";

export const fetchNwfbCtbEtas = async ({ co, stopId, route, bound, seq }) => {
  const response = await axios.get(`https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${co}/${stopId}/${route}`);

  const { data } = response.data;

  const seqSet = [...new Set(data.map((e) => e.seq))];
  let correctSeq;

  if (seqSet.length > 1) {
    // Find correct seq if one Stop have two ETA
    correctSeq = findNearestNumber(seq, seqSet);
  } else {
    correctSeq = seqSet[0];
  }

  return data
    .filter((e) => e.eta !== null && bound?.includes(e.dir) && e.seq === correctSeq)
    .map((e) => ({
      co,
      eta: e.eta,
      rmk_tc: e.rmk_tc,
      stopId,
      seq: e.seq,
    }));
};

export const fetchNwfbCtbRouteStop = async ({ co, route, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/${co}/${route}/${bound === "I" ? "inbound" : "outbound"}`
  );

  const { data } = response.data;

  return data;
};
