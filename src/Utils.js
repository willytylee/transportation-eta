import moment from "moment";
import axios from "axios";

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

export const setStopMap = () => {
  const stopMapLocal = localStorage.getItem("stopMap");
  if (!stopMapLocal) {
    axios
      .get("https://hkbus.github.io/hk-bus-crawling/routeFareList.min.json")
      .then((response) => {
        localStorage.setItem("stopMap", JSON.stringify(response.data.stopMap));
      });
  }
};

export const setKmbStopList = () => {
  const kmbStopListLocal = localStorage.getItem("kmbStopList");
  if (!kmbStopListLocal) {
    axios
      .get("https://data.etabus.gov.hk/v1/transport/kmb/stop/")
      .then((response) => {
        localStorage.setItem("kmbStopList", JSON.stringify(response.data.data));
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
          JSON.stringify(response.data.data)
        );
      });
  }
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

export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
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
