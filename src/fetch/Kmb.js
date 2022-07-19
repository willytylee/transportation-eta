import axios from "axios";

export const fetchEtas = async ({ stopId, route, seq, serviceType, bound }) => {
  const response = await axios.get(
    `https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`
  );

  return response.data.data
    .filter((e) => e.eta !== null && e.dir === bound && e.seq === seq)
    .map((e) => ({
      co: "kmb",
      eta: e.eta,
      remark: {
        zh: e.rmk_tc,
        en: e.rmk_en,
      },
    }));
};
