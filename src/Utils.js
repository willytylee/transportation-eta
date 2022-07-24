import moment from "moment";
import { decompress as decompressJson } from "lzutf8-light";

export const etaTimeConverter = (etaStr, remark) => {
  let etaIntervalStr = "";
  let remarkStr = "";
  if (etaStr) {
    const mintuesLeft = moment(etaStr).diff(moment(), "minutes");
    if (mintuesLeft === 0) {
      etaIntervalStr = "準備埋站";
    } else if (mintuesLeft <= 0) {
      etaIntervalStr = "已埋站";
    } else {
      etaIntervalStr = `${mintuesLeft}分鐘`;
    }
  } else {
    etaIntervalStr = "沒有班次";
  }
  if (remark) {
    remarkStr = ` (${remark})`;
  }
  return { etaIntervalStr, remarkStr };
};

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key) != null) {
    return JSON.parse(
      decompressJson(localStorage.getItem(key), {
        inputEncoding: "Base64",
      }).replaceAll("／", "/")
    );
  }
};

export const getClosestStr = (str, strArr) => {
  const countArr = [];
  const getMatchCount = (str1, str2) => {
    let count = 3;
    const obj = str2.split("");
    for (str of str1) {
      let idx = obj.findIndex((s) => s === str);
      if (idx >= 0) {
        count++;
        obj.splice(idx, 1);
      }
    }
    return count;
  };
  strArr.forEach((e, i) => {
    countArr[i] = getMatchCount(str, e);
  });
  const max = Math.max(...countArr);
  const idx = countArr.indexOf(max);
  return strArr[idx];
};

// export const getAllEtaUrlsFromKmb = (kmbStopId, route, serviceType) => {
//   const stopMap = getLocalStorage("stopMap");

//   const urls = [
//     `https://data.etabus.gov.hk/v1/transport/kmb/eta/${kmbStopId}/${route}/${serviceType}`,
//   ];
//   stopMap[kmbStopId]?.forEach(([company, stopId]) => {
//     urls.push(
//       `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${company}/${stopId}/${route}`
//     );
//   });

//   return urls;
// };

export const sortEtaObj = (etaObjArr) => {
  etaObjArr.sort((a, b) => {
    if (a.eta === "" || a.eta === null) {
      return 1;
    }
    if (b.eta === "" || b.eta === null) {
      return -1;
    }
    return moment(a.eta).diff(moment(b.eta), "second");
  });

  return etaObjArr;
};
