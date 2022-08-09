import axios from "axios";

export const fetchKmbEtas = async ({
  stopId,
  route,
  serviceType,
  seq,
  bound,
}) => {
  const response = await axios.get(
    `https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`
  );

  let { data } = response.data;

  const ACCEPT_RANGE = 1;

  return data
    .filter((e) => {
      return (
        e.eta !== null &&
        e.dir === bound &&
        ((seq >= e.seq - ACCEPT_RANGE && seq <= e.seq + ACCEPT_RANGE) ||
          seq === e.seq) // Only accept the seq +- 1 in order
      );
    })
    .map((e) => ({
      co: "kmb",
      eta: e.eta,
      seq: e.seq,
      rmk_tc: e.rmk_tc,
      stopId,
    }));
};
