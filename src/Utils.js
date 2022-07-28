import { useContext, useMemo } from "react";
import moment from "moment";
import { decompress as decompressJson } from "lzutf8-light";
import { AppContext } from "./context/AppContext";

export const etaTimeConverter = (etaStr, remark) => {
  let etaIntervalStr, remarkStr;

  if (moment(etaStr).isValid()) {
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

const getMatchCount = (str1, str2) => {
  let count = 0;
  const obj = str2.split("");
  for (const str of str1) {
    let idx = obj.findIndex((s) => s === str);
    if (idx >= 0) {
      count++;
      obj.splice(idx, 1);
    }
  }
  return count;
};

export const getClosestStr = (str, strArr) => {
  const countArr = [];
  strArr.forEach((e, i) => {
    countArr[i] = getMatchCount(str, e);
  });
  const max = Math.max(...countArr);
  const idx = countArr.indexOf(max);
  return strArr[idx];
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

export const mergeMissingStops = ({ gRouteList, gtfsId, route }) => {
  return Object.keys(gRouteList).map((e) => gRouteList[e]);
};
