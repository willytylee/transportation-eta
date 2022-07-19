import axios from "axios";

export const fetchEtas = async ({ stopId, route, seq, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/nwfb/${stopId}/${route}`
  );

  console.log({ stopId, route, seq, bound });
  console.log(response.data.data);

  return response.data.data
    .filter((e) => e.eta !== null && bound.includes(e.dir))
    .map((e) => {
      return {
        co: "nwfb",
        eta: e.eta,
        remark: {
          zh: e.rmk_tc,
          en: e.rmk_en,
        },
      };
    });
};
