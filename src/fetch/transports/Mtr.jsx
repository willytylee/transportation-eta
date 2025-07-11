import axios from "axios";

export const fetchMtrEtas = async ({ stopId, route, bound }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${route}&sta=${stopId}&lang=tc`
  );

  const { data } = response.data;
  const etas = data[Object.keys(data)[0]];

  if (bound === "UT") {
    return etas.UP.map((e) => ({
      co: "mtr",
      eta: e.time,
      seq: e.seq,
      dest: e.dest,
      ttnt: e.ttnt,
      plat: e.plat
        .toString()
        .replace(/1/g, "①")
        .replace(/2/g, "②")
        .replace(/3/g, "③")
        .replace(/4/g, "④"),
      stopId,
    }));
  } else if (bound === "DT") {
    return etas.DOWN.map((e) => ({
      co: "mtr",
      eta: e.time,
      seq: e.seq,
      dest: e.dest,
      ttnt: e.ttnt,
      plat: e.plat
        .toString()
        .replace(/1/g, "①")
        .replace(/2/g, "②")
        .replace(/3/g, "③")
        .replace(/4/g, "④"),
      stopId,
    }));
  }

  const downArr = etas.DOWN || [];
  const upArr = etas.UP || [];
  const fullArr = downArr.concat(upArr);

  return fullArr.map((e) => ({
    co: "mtr",
    eta: e.time,
    seq: e.seq,
    dest: e.dest,
    ttnt: e.ttnt,
    plat: e.plat
      .toString()
      .replace(/1/g, "①")
      .replace(/2/g, "②")
      .replace(/3/g, "③")
      .replace(/4/g, "④"),
    stopId,
  }));
};
