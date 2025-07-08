import axios from "axios";

export const fetchNlbEtas = async ({ stopId, nlbId }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v2/transport/nlb/stop.php?action=estimatedArrivals&routeId=${nlbId}&stopId=${stopId}`
  );

  const { estimatedArrivals } = response.data;

  return estimatedArrivals.map((e) => ({
    co: "nlb",
    eta: e.estimatedArrivalTime,
    stopId,
  }));
};
