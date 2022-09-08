import moment from "moment";
import {
  compress as compressJson,
  decompress as decompressJson,
} from "lzutf8-light";
import { coPriority } from "../constants/Constants";

export const etaTimeConverter = ({ etaStr, remark }) => {
  let etaIntervalStr, remarkStr;

  if (moment(etaStr, "YYYY-MM-DD HH:mm:ss").isValid()) {
    const mintuesLeft = moment(etaStr).diff(moment(), "minutes");
    if (mintuesLeft === 0) {
      etaIntervalStr = "準備埋站";
    } else if (mintuesLeft <= 0) {
      etaIntervalStr = "已埋站";
    } else {
      etaIntervalStr = `${mintuesLeft}分鐘`;
    }
  } else if (etaStr === "") {
    if (remark) {
      etaIntervalStr = `${remark}`;
    } else {
      etaIntervalStr = "沒有班次";
    }
  }
  if (remark) {
    remarkStr = `${remark}`;
  }

  return { etaIntervalStr, remarkStr };
};

export const phaseEtaToWaitingMins = (etaStr) => {
  if (moment(etaStr, "YYYY-MM-DD HH:mm:ss").isValid()) {
    return moment(etaStr).diff(moment(), "minutes");
  }
  return null;
};

export const phaseEtaToTime = (etaStr) => {
  if (moment(etaStr, "YYYY-MM-DD HH:mm:ss").isValid()) {
    return moment(etaStr).format("HH:mm");
  }
  return "";
};

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key) != null) {
    return JSON.parse(
      decompressJson(localStorage.getItem(key), {
        inputEncoding: "Base64",
      })
        .replaceAll("／", "/")
        .replaceAll("　", " ")
    );
  }
};

export const setLocalStorage = (key, data) => {
  localStorage.setItem(
    key,
    compressJson(JSON.stringify(data), {
      outputEncoding: "Base64",
    })
  );
};

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

export const getHeatIndex = (temperature, humidity) => {
  const F = temperature * 1.8 + 32;
  const heatIndex =
    -42.379 +
    2.04901523 * F +
    10.14333127 * humidity -
    0.22475541 * F * humidity -
    0.00683783 * F * F -
    0.05481717 * humidity * humidity +
    0.00122874 * F * F * humidity +
    0.00085282 * F * humidity * humidity -
    0.00000199 * F * F * humidity * humidity;
  return (heatIndex - 32) / 1.8;
};

export const getCoByRouteObj = (routeObj) =>
  routeObj.co.reduce((prev, curr) => {
    if (Object.keys(routeObj.stops).includes(curr)) {
      prev.push(curr);
    }
    return prev;
  }, []);

export const getCoIconByRouteObj = (routeObj) => {
  const companyList = routeObj.co.reduce((prev, curr) => {
    if (Object.keys(routeObj.stops).includes(curr)) {
      prev.push(curr);
    }
    return prev;
  }, []);
  return companyList.sort((a, b) => (a > b ? 1 : -1)).join("_");
};

export const getCoPriorityId = (currRoute) => {
  let companyId = "";
  for (const e of coPriority) {
    if (Object.keys(currRoute.stops).includes(e)) {
      companyId = e;
      break;
    }
  }
  return companyId;
};

export const basicFiltering = (e) =>
  (e.co.includes("kmb") ||
    e.co.includes("nwfb") ||
    e.co.includes("ctb") ||
    e.co.includes("gmb") ||
    e.co.includes("mtr")) &&
  e.dest.en !== e.orig.en &&
  e.dest.zh !== e.orig.zh;

export const sortByCompany = (a, b) => {
  const coA = coPriority.indexOf(getCoByRouteObj(a)[0]);
  const coB = coPriority.indexOf(getCoByRouteObj(b)[0]);
  if (coA < coB) {
    return -1;
  }
  if (coA > coB) {
    return 1;
  }
  return 0;
};

export const parseMtrEtas = (e) =>
  parseInt(e.ttnt, 10) === 0
    ? "準備埋站"
    : parseInt(e.ttnt, 10) >= 60
    ? moment(e.eta, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
    : `${e.ttnt}分鐘`;

export const isMatchRoute = (a, b) =>
  JSON.stringify(a.bound) === JSON.stringify(b.bound) &&
  JSON.stringify(a.co) === JSON.stringify(b.co) &&
  JSON.stringify(a.orig) === JSON.stringify(b.orig) &&
  JSON.stringify(a.dest) === JSON.stringify(b.dest) &&
  JSON.stringify(a.route) === JSON.stringify(b.route) &&
  JSON.stringify(a.seq) === JSON.stringify(b.seq) &&
  JSON.stringify(a.serviceType) === JSON.stringify(b.serviceType);

export const setRouteListHistory = (routeObj) => {
  let routeListHistory;

  try {
    routeListHistory = JSON.parse(
      decompressJson(localStorage.getItem("routeListHistory") || "W10=", {
        // "W10=" = compressed []
        inputEncoding: "Base64",
      })
    );
  } catch (error) {
    // Reset routeListHistory LocalStorage
    localStorage.removeItem("routeListHistory");
    routeListHistory = [];
  }

  const isInHistory = routeListHistory.filter((e) => isMatchRoute(e, routeObj));

  if (isInHistory.length === 0) {
    if (routeListHistory.length >= 10) {
      routeListHistory.pop();
    }
    routeListHistory.unshift(routeObj);
    setLocalStorage("routeListHistory", routeListHistory);
  }
};

export const findNearestNumber = (goal, arr) =>
  arr.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  );
