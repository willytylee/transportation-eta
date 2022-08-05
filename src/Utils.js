import moment from "moment";
import { decompress as decompressJson } from "lzutf8-light";
import { fetchNwfbCtbRouteStop } from "./fetch/transports/NwfbCtb";

export const etaTimeConverter = (etaStr, remark) => {
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
  } else if (etaStr === "loading") {
    etaIntervalStr = "載入中...";
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

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key) != null) {
    return JSON.parse(
      decompressJson(localStorage.getItem(key), {
        inputEncoding: "Base64",
      }).replaceAll("／", "/")
    );
  }
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

export const isValofObjEqualInArr = (arr, key) => {
  return arr.every((e) => {
    if (e[key] === arr[0][key]) {
      return true;
    }
  });
};

export const isValEqualInArr = (arr) => {
  return arr.every((e) => {
    if (e === arr[0]) {
      return true;
    }
  });
};

export const findNearestNum = (target, arr) => {
  return arr.reduce((a, b) => {
    let aDiff = Math.abs(a - target);
    let bDiff = Math.abs(b - target);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
};

export const findCorrectBound = async ({
  expandStopIdArr,
  currRoute,
  companyId,
}) => {
  const StopsI = await fetchNwfbCtbRouteStop({
    ...currRoute,
    co: companyId,
    bound: "I",
  });

  const StopsO = await fetchNwfbCtbRouteStop({
    ...currRoute,
    co: companyId,
    bound: "O",
  });

  const arrI = StopsI.map((e) => e.stop);
  const arrO = StopsO.map((e) => e.stop);

  let scoreI = 0;
  let scoreO = 0;

  for (let i = 1; i < expandStopIdArr.length - 1; i++) {
    for (let j = 0; j < arrI.length - 1; j++) {
      if (
        expandStopIdArr[i - 1] === arrI[j - 1] &&
        expandStopIdArr[i] === arrI[j]
      ) {
        scoreI++;
      }
    }
    for (let k = 0; k < arrO.length - 1; k++) {
      if (
        expandStopIdArr[i - 1] === arrO[k - 1] &&
        expandStopIdArr[i] === arrO[k]
      ) {
        scoreO++;
      }
    }
  }
  return { scoreI, scoreO };
};

export const getUniqueValFromArr = (arr, key) => {
  return arr.reduce((prev, curr) => {
    if (!prev.includes(curr[key])) {
      prev.push(curr[key]);
    }
    return prev;
  }, []);
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

export const getActualCoIds = (routeObj) => {
  return routeObj.co.reduce((prev, curr) => {
    if (Object.keys(routeObj.stops).includes(curr)) {
      prev.push(curr);
    }
    return prev;
  }, []);
};
