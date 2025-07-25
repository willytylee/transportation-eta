import moment from "moment";
import {
  compress as compressJson,
  decompress as decompressJson,
} from "lzutf8-light";
import { coPriority } from "../constants/Constants";

export const phaseEta = ({ etaStr, remark }) => {
  let etaIntervalStr, remarkStr, waitingMins, time;
  if (moment(etaStr, "YYYY-MM-DD HH:mm").isValid()) {
    const mintuesLeft = moment(etaStr).diff(
      moment().format("YYYY-MM-DD HH:mm"),
      "minutes"
    );
    if (mintuesLeft < 0) {
      etaIntervalStr = "已離開";
    } else if (mintuesLeft === 0) {
      etaIntervalStr = "已抵達";
    } else if (mintuesLeft > 0 && mintuesLeft <= 60) {
      etaIntervalStr = (
        <>
          {mintuesLeft}
          <span style={{ fontSize: "10px" }}>分鐘</span>
        </>
      );
    } else if (mintuesLeft > 60) {
      etaIntervalStr = moment(etaStr).format("HH:mma");
    }
    waitingMins = moment(etaStr).diff(
      moment().format("YYYY-MM-DD HH:mm"),
      "minutes"
    );
    time = moment(etaStr).format("HH:mma");
  } else if (etaStr === "") {
    if (remark) {
      etaIntervalStr = `${remark}`;
    } else {
      etaIntervalStr = "沒有班次";
    }
  } else if (etaStr === false) {
    etaIntervalStr = "路線已更變, 請刪除及重新將路線加入書籤";
  } else {
    etaIntervalStr = etaStr;
  }
  if (remark) {
    remarkStr = `${remark}`;
  }

  return { etaIntervalStr, remarkStr, waitingMins, time };
};

export const convertLrtMinsToEta = (mins) => {
  let eta;
  const number = mins.match(/\d+/) ? parseInt(mins.match(/\d+/)[0], 10) : null;
  if (mins === "-") {
    eta = moment().format("YYYY-MM-DD HH:mm");
  } else if (number) {
    const mintues = parseInt(mins.match(/\d+/)[0], 10);
    eta = moment().add(mintues, "minutes").format("YYYY-MM-DD HH:mm");
  } else {
    eta = mins;
  }
  return eta;
};

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key) != null) {
    return JSON.parse(
      decompressJson(localStorage.getItem(key), {
        inputEncoding: "Base64",
      })
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
    if (
      a.eta &&
      b.eta &&
      moment(a.eta, "YYYY-MM-DD HH:mm").isValid() &&
      moment(b.eta, "YYYY-MM-DD HH:mm").isValid()
    ) {
      return moment(a.eta).diff(moment(b.eta), "second");
    }
    return false;
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
    prev.push(curr);
    return prev;
  }, []);
  return companyList.sort((a, b) => (a > b ? 1 : -1)).join("_");
};

export const getFirstCoByRouteObj = (routeObj) => {
  // Method: If the routeObj's stops included the company,
  // get the first match from coPriority
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
  e.co.includes("kmb") ||
  e.co.includes("nwfb") ||
  e.co.includes("ctb") ||
  e.co.includes("gmb") ||
  e.co.includes("nlb") ||
  e.co.includes("mtr") ||
  e.co.includes("lightRail") ||
  e.co.includes("lrtfeeder");

export const sortByCompany = (routeObjA, routeObjB) => {
  const coA = coPriority.indexOf(getFirstCoByRouteObj(routeObjA));
  const coB = coPriority.indexOf(getFirstCoByRouteObj(routeObjB));
  if (coA < coB) {
    return -1;
  }
  if (coA > coB) {
    return 1;
  }
  return 0;
};

export const findNearestNumber = (goal, arr) =>
  arr.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  );

export const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

export const upgradeBookmark = (bookmark) => {
  const routeList = getLocalStorage("routeList");
  const bookmarkV2 = [];
  bookmark.forEach((e) => {
    e.data.forEach((f) => {
      f.forEach((g) => {
        if (!g.routeKey) {
          if (g.co === "mtr") {
            g.bound.forEach((h) => {
              if (h === "up") {
                const routeKey = Object.keys(routeList).find(
                  (key) =>
                    routeList[key].route === g.route &&
                    routeList[key].bound["mtr"] === "UT" &&
                    routeList[key].stops["mtr"].includes(g.stopId)
                );
                if (routeKey) {
                  g.routeKey = routeKey;
                  delete g.co;
                  delete g.route;
                  delete g.bound;
                }
              } else if (h === "down") {
                const routeKey = Object.keys(routeList).find(
                  (key) =>
                    routeList[key].route === g.route &&
                    routeList[key].bound["mtr"] === "DT" &&
                    routeList[key].stops["mtr"].includes(g.stopId)
                );
                if (routeKey) {
                  g.routeKey = routeKey;
                  delete g.co;
                  delete g.route;
                  delete g.bound;
                }
              }
            });
          } else {
            const routeKey = Object.keys(routeList).find(
              (key) =>
                routeList[key].route === g.route &&
                routeList[key].co.includes(g.co) &&
                routeList[key].stops[g.co][g.seq - 1] === g.stopId
            );
            if (routeKey) {
              g.routeKey = routeKey;
              delete g.co;
              delete g.route;
            }
          }
        }
      });
      bookmarkV2.push({
        title: e.title,
        data: f,
      });
    });
  });

  return bookmarkV2;
};
