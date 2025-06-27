import axios from "axios";

export const fetchGmbEtas = async ({ seq, gtfsId, stopId, route }) => {
  const response = await axios.get(`https://data.etagmb.gov.hk/eta/route-stop/${gtfsId}/${stopId}`);

  const { data } = response.data;

  return data.filter((e) => seq === e.stop_seq)[0].eta.map((e) => ({ co: "gmb", eta: e.timestamp, seq, route }));
};
