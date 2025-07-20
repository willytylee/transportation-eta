import axios from "axios";
import { convertLrtMinsToEta } from "../../utils/Utils";

export const fetchLrtEtas = async ({ stopId, route, dest }) => {
  const _stopId = stopId.replace("LR", "");

  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${_stopId}`
  );

  const { data } = response;

  return data.platform_list.reduce((result, platform) => {
    const matchingRoutes = platform.route_list
      .filter((e) => e.route_no === route && e.dest_en === dest.en)
      .map((e) => ({
        co: "lightRail",
        train_length: e.train_length,
        dest: e.dest_ch,
        eta: convertLrtMinsToEta(e.time_ch),
        route: e.route_no,
        plat: platform.platform_id
          .toString()
          .replace(/1/g, "①")
          .replace(/2/g, "②")
          .replace(/3/g, "③")
          .replace(/4/g, "④")
          .replace(/5/g, "⑤")
          .replace(/6/g, "⑥"),
        stopId,
      }));
    return [...result, ...matchingRoutes];
  }, []);
};

export const fetchLrtStopInfo = async ({ stopId }) => {
  const _stopId = stopId.replace("LR", "");

  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${_stopId}`
  );

  const { data } = response;

  return data.platform_list.reduce((result, platform) => {
    const routes = platform.route_list.map((e) => ({
      co: ["lightRail"],
      train_length: e.train_length,
      dest: e.dest_ch,
      eta: convertLrtMinsToEta(e.time_ch),
      route: e.route_no,
      plat: platform.platform_id
        .toString()
        .replace(/1/g, "①")
        .replace(/2/g, "②")
        .replace(/3/g, "③")
        .replace(/4/g, "④")
        .replace(/5/g, "⑤")
        .replace(/6/g, "⑥"),
      stopId,
    }));
    return [...result, ...routes];
  }, []);
};
