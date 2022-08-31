import axios from "axios";

export const fetchMtrEtas = async ({ stopId, route }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${route}&sta=${stopId}&lang=tc`
  );

  const { data } = response.data;

  const upDownEtas = data[Object.keys(data)[0]];

  const downArr = upDownEtas.DOWN
    ? upDownEtas.DOWN.map((e) => ({ ...e, bound: "down" }))
    : [];

  const upArr = upDownEtas.UP
    ? upDownEtas.UP.map((e) => ({ ...e, bound: "up" }))
    : [];

  const fullArr = downArr.concat(upArr);

  return fullArr.map((e) => ({
    co: "mtr",
    eta: e.time,
    seq: e.seq,
    dest: e.dest,
    ttnt: e.ttnt,
    bound: e.bound,
    stopId,
  }));
};
