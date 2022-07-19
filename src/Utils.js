import moment from "moment";
import axios from "axios";
import { compress as compressJson } from "lzutf8-light";
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

export const setRouteFareList = () => {
  const stopMapLocal = localStorage.getItem("stopMap");
  const routeListLocal = localStorage.getItem("routeList");
  if (!stopMapLocal || !routeListLocal) {
    axios
      .get("https://hkbus.github.io/hk-bus-crawling/routeFareList.min.json")
      .then((response) => {
        localStorage.setItem(
          "stopMap",
          compressJson(JSON.stringify(response.data.stopMap), {
            outputEncoding: "Base64",
          })
        );
        localStorage.setItem(
          "routeList",
          compressJson(JSON.stringify(response.data.routeList), {
            outputEncoding: "Base64",
          })
        );
        localStorage.setItem(
          "stopList",
          compressJson(JSON.stringify(response.data.stopList), {
            outputEncoding: "Base64",
          })
        );
      });
  }
};

export const setKmbStopList = () => {
  const kmbStopListLocal = localStorage.getItem("kmbStopList");
  if (!kmbStopListLocal) {
    axios
      .get("https://data.etabus.gov.hk/v1/transport/kmb/stop/")
      .then((response) => {
        localStorage.setItem(
          "kmbStopList",
          compressJson(JSON.stringify(response.data.data), {
            outputEncoding: "Base64",
          })
        );
      });
  }
};

export const setKmbRouteList = () => {
  const kmbRouteListLocal = localStorage.getItem("kmbRouteList");
  if (!kmbRouteListLocal) {
    axios
      .get("https://data.etabus.gov.hk//v1/transport/kmb/route/")
      .then((response) => {
        localStorage.setItem(
          "kmbRouteList",
          compressJson(JSON.stringify(response.data.data), {
            outputEncoding: "Base64",
          })
        );
      });
  }
};

export const getLocalStorage = (key) => {
  return JSON.parse(
    decompressJson(localStorage.getItem(key), { inputEncoding: "Base64" })
  );
};

export const getAllEtaUrlsFromKmb = (kmbStopId, route, serviceType) => {
  const stopMap = getLocalStorage("stopMap");
  const _stopIds = stopMap[kmbStopId];

  const urls = [
    `https://data.etabus.gov.hk/v1/transport/kmb/eta/${kmbStopId}/${route}/${serviceType}`,
  ];
  _stopIds?.forEach(([company, stopId]) => {
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
