import axios from "axios";
import moment from "moment";

export const fetchLrtFeederEtas = async ({ stopId, route, seq }) => {
  const response = await axios.post(
    `https://rt.data.gov.hk/v1/transport/mtr/bus/getSchedule`,
    {
      language: "zh",
      routeName: route,
    }
  );

  const { data } = response;

  const result = data.busStop
    .filter((e) => e.busStopId === stopId)[0]
    .bus.filter(
      (e) => e.arrivalTimeInSecond >= 0 && e.departureTimeInSecond >= 0
    )
    .map((e) => ({
      co: "lrtfeeder",
      eta: moment()
        .add(
          seq === 1 ? e.departureTimeInSecond : e.arrivalTimeInSecond,
          "seconds"
        )
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

  return result;
};
