import moment from "moment";
import { compress as compressJson, decompress as decompressJson } from "lzutf8-light";
import { coPriority } from "../constants/Constants";
import { fetchEtas } from "../fetch/transports";

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
  } else if (etaStr === false) {
    etaIntervalStr = "路線錯誤, 請刪除及重新將路線加入書籤";
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
        .replaceAll("（", "(")
        .replaceAll("）", ")")
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

export const getCoIconByRouteObj = (routeObj) => {
  const companyList = routeObj.co.reduce((prev, curr) => {
    if (Object.keys(routeObj.stops).includes(curr)) {
      prev.push(curr);
    }
    return prev;
  }, []);
  return companyList.sort((a, b) => (a > b ? 1 : -1)).join("_");
};

export const getCoPriorityId = (routeObj) => {
  let companyId = "";
  for (const e of coPriority) {
    if (Object.keys(routeObj.stops).includes(e)) {
      companyId = e;
      break;
    }
  }
  return companyId;
};

export const basicFiltering = (e) =>
  (e.co.includes("kmb") || e.co.includes("nwfb") || e.co.includes("ctb") || e.co.includes("gmb") || e.co.includes("mtr")) &&
  e.dest.en !== e.orig.en &&
  e.dest.zh !== e.orig.zh;

export const sortByCompany = (a, b) => {
  const coA = coPriority.indexOf(getCoPriorityId(a));
  const coB = coPriority.indexOf(getCoPriorityId(b));
  if (coA < coB) {
    return -1;
  }
  if (coA > coB) {
    return 1;
  }
  return 0;
};

export const parseMtrEtas = (e) =>
  parseInt(e.ttnt, 10) === 0 ? "準備埋站" : parseInt(e.ttnt, 10) >= 60 ? moment(e.eta, "YYYY-MM-DD HH:mm:ss").format("HH:mm") : `${e.ttnt}分鐘`;

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

export const findNearestNumber = (goal, arr) => arr.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));

export const handleTableResult = (sectionData) =>
  sectionData.map((e) => {
    const {
      co,
      etas,
      route,
      stopName,
      location: { lat, lng },
    } = e;

    return {
      co: etas ? co : "error",
      route,
      etas: etas
        ? etas.length === 0
          ? ["沒有班次"]
          : etas.map((f) => etaTimeConverter({ etaStr: f.eta, remark: f.rmk_tc }).etaIntervalStr).slice(0, 3)
        : ["路線錯誤, 請刪除及重新將路線加入書籤!!!!"],

      stopName,
      latLngUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`,
    };
  });

export const fetchBusEta = async (gStopList, gRouteList, section) => {
  const allPromises = [];

  for (let i = 0; i < section.length; i += 1) {
    const { co, route, stopId, seq, gtfsId } = section[i];

    // Required field: route, company, seq and stopID
    let routeObj = Object.keys(gRouteList)
      .map((e) => gRouteList[e])
      .filter(
        (e) =>
          (route ? e.route === route : true) && // For bus
          (gtfsId ? e.gtfsId === gtfsId : true) && // For Gmb
          Object.keys(e.stops).includes(co) && // Use routeObj.stops's company as standard
          (e.stops[co] ? e.stops[co][seq - 1] === stopId : true)
      )[0];
    // Even if there are more than one result, the ETAs should be the same,
    // so [0] can be applied here

    if (!routeObj) {
      routeObj = { error: true };
    }

    const promise = fetchEtas({ ...routeObj, seq: parseInt(seq, 10) });
    allPromises.push(promise);
  }

  const etas = await Promise.all(allPromises);

  return etas.map((e, i) => {
    const { route, stopId, co } = section[i];
    const stopName = gStopList[stopId].name.zh;
    const { location } = gStopList[stopId];
    return {
      etas: e,
      route,
      stopName,
      location,
      stopId,
      co,
    };
  });
};

export const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});
