import axios from "axios";

export const fetchNwfbCtbEtas = async ({ co, stopId, route, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${co}/${stopId}/${route}`
  );

  const { data } = response.data;

  return data
    .filter((e) => e.eta !== null && bound?.includes(e.dir))
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
    `https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/${co}/${route}/${
      bound === "I" ? "inbound" : "outbound"
    }`
  );

  const { data } = response.data;

  return data;
};
