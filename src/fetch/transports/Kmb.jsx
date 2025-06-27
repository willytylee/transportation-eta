import axios from "axios";
import { findNearestNumber } from "../../Utils/Utils";

export const fetchKmbEtas = async ({ stopId, route, serviceType, seq, bound }) => {
  const response = await axios.get(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`);

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
    .filter((e) => e.eta !== null && e.dir === bound && e.seq === correctSeq)
    .map((e) => ({
      co: "kmb",
      eta: e.eta,
      seq: e.seq,
      rmk_tc: e.rmk_tc,
      stopId,
    }));
};
