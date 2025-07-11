import axios from "axios";
import moment from "moment";

export const fetchLrtEtas = async ({ stopId, route, dest }) => {
  const _stopId = stopId.replace("LR", "");

  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${_stopId}`
  );

  const { data } = response;

  return data.platform_list.reduce((result, platform) => {
    const matchingRoutes = platform.route_list
      .filter((e) => e.route_no === route && e.dest_en === dest.en)
      .map((e) => {
        let eta;
        const number = e.time_ch.match(/\d+/)
          ? parseInt(e.time_ch.match(/\d+/)[0], 10)
          : null;
        if (e.time_ch === "-") {
          eta = moment().format("YYYY-MM-DD HH:mm:ss");
        } else if (number) {
          const mintues = parseInt(e.time_ch.match(/\d+/)[0], 10);
          eta = moment().add(mintues, "minutes").format("YYYY-MM-DD HH:mm:ss");
        } else {
          eta = e.time_ch;
        }

        return {
          co: "lightRail",
          train_length: e.train_length,
          dest: e.dest_ch,
          eta,
          route: e.route_no,
          plat: platform.platform_id,
          stopId,
        };
      });
    return [...result, ...matchingRoutes];
  }, []);
};
