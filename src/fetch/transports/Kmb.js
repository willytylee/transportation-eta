import axios from "axios";

export const fetchKmbEtas = async ({ stopId, route, serviceType, bound }) => {
  const response = await axios.get(
    `https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`
  );

  return response.data.data
    .filter((e) => {
      return e.eta !== null && e.dir === bound;
    })
    .map((e) => ({
      co: "kmb",
      eta: e.eta,
      rmk_tc: e.rmk_tc,
      stopId,
    }));
};
