import axios from "axios";

export const fetchMtrEtas = async ({ stopId, route, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${route}&sta=${stopId}`
  );

  const _bound = bound.map((e) => {
    if (e === "up" || e === "UT") {
      return "up";
    } else if (e === "down" || e === "DT") {
      return "down";
    }
  });

  const { data } = response.data;

  const upDownEtas = data[Object.keys(data)[0]];

  const downArr = upDownEtas.DOWN
    ? upDownEtas.DOWN.map((e) => {
        return { ...e, bound: "down" };
      })
    : [];

  const upArr = upDownEtas.UP
    ? upDownEtas.UP.map((e) => {
        return { ...e, bound: "up" };
      })
    : [];

  const fullArr = downArr.concat(upArr);

  return fullArr
    .filter((e) => _bound.includes(e.bound))
    .map((e) => ({
      co: "mtr",
      eta: e.time,
      seq: e.seq,
      dest: e.dest,
      ttnt: e.ttnt,
      bound: e.bound,
      stopId,
    }));
};

// export const fetchMtrEtas = async ({ stopId, route }) => {
//   const response = await axios.get(
//     `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${route}&sta=${stopId}`
//   );

//   const { data } = response.data;

//   return data[Object.keys(data)[0]];
// };
