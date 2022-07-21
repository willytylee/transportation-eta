import moment from "moment";
import { decompress as decompressJson } from "lzutf8-light";

export const etaTimeConverter = (etaString, remark) => {
  if (etaString) {
    const mintuesLeft = moment(etaString).diff(moment(), "minutes");
    if (mintuesLeft === 0) {
      return "準備埋站";
    } else if (mintuesLeft <= 0) {
      return "已埋站";
    } else {
      return `${mintuesLeft}分鐘`;
    }
  } else {
    if (remark) {
      return remark;
    } else {
      return "沒有班次";
    }
  }
};

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key) != null) {
    return JSON.parse(
      decompressJson(localStorage.getItem(key), { inputEncoding: "Base64" })
    );
  }
};

export const getAllEtaUrlsFromKmb = (kmbStopId, route, serviceType) => {
  const stopMap = getLocalStorage("stopMap");

  const urls = [
    `https://data.etabus.gov.hk/v1/transport/kmb/eta/${kmbStopId}/${route}/${serviceType}`,
  ];
  stopMap[kmbStopId]?.forEach(([company, stopId]) => {
    urls.push(
      `https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/eta/${company}/${stopId}/${route}`
    );
  });

  return urls;
};

export const sortEtaObject = (etaObjectArray) => {
  etaObjectArray.sort((a, b) => {
    if (a.eta === "" || a.eta === null) {
      return 1;
    }
    if (b.eta === "" || b.eta === null) {
      return -1;
    }
    return moment(a.eta).diff(moment(b.eta), "second");
  });

  return etaObjectArray;
};
