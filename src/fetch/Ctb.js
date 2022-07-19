import axios from "axios";

export const fetchEtas = async ({ stopId, route, seq, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/ctb/${stopId}/${route}`
  );

  return response.data.data
    .filter((e) => e.eta !== null && e.dir === bound && e.seq === seq)
    .map((e) => ({
      co: "ctb",
      eta: e.eta,
      remark: {
        zh: e.rmk_tc,
        en: e.rmk_en,
      },
    }));
};
