import axios from "axios";

export const fetchNwfbCtbEtas = async ({
  co,
  stopId,
  route,
  bound,
  dest,
  orig,
}) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${co}/${stopId}/${route}`
  );

  const { data } = response.data;

  // const getMatchCount = (str1, str2) => {
  //   let count = 0;
  //   const obj = str2.split("");
  //   for (const str of str1) {
  //     let idx = obj.findIndex((s) => s === str);
  //     if (idx >= 0) {
  //       count++;
  //       obj.splice(idx, 1);
  //     }
  //   }
  //   return count;
  // };

  // const getNearestStr = (str, strArr) => {
  //   const countArr = [];
  //   strArr.forEach((e, i) => {
  //     countArr[i] = getMatchCount(str, e);
  //   });
  //   const max = Math.max(...countArr);
  //   const idx = countArr.indexOf(max);
  //   return strArr[idx];
  // };

  // // Take the destination list if one stop have multi direction eta
  // const destList = data.reduce((prev, curr) => {
  //   if (!prev.includes(curr.dest_tc)) {
  //     prev.push(curr.dest_tc);
  //   }
  //   return prev;
  // }, []);

  // // Compare the destination list item to the Route Orig and Dest:
  // // Filter out the correct destination by the matchCount of dest >= the matchCount orig
  // // Some of the route dest = orig, they have the same matchCount, need to use >= instead of >
  // const correctDestList = destList.filter(
  //   (e) =>
  //     getMatchCount(e, dest.zh) >= getMatchCount(e, orig.zh) &&
  //     getMatchCount(e, dest.zh) > 0
  // );

  // const correctDest = getNearestStr(dest.zh, correctDestList);

  return data
    .filter(
      (e) => e.eta !== null && bound?.includes(e.dir)
      //  && e.dest_tc === correctDest
    )
    .map((e) => {
      return {
        co,
        eta: e.eta,
        rmk_tc: e.rmk_tc,
        stopId,
        seq: e.seq,
      };
    });
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
