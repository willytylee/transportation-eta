import { useContext } from "react";
import { basicFiltering } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { sortByCompany } from "../../../Utils/Utils";
import { SimpleRouteList } from "./SimpleRouteList";

export const SearchRouteList = () => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);

  const sortByRoute = (a, b) => {
    let routeReturn = 0;
    if (gRouteList[a].route < gRouteList[b].route) {
      routeReturn = -1;
    }
    if (gRouteList[a].route > gRouteList[b].route) {
      routeReturn = 1;
    }

    return routeReturn || sortByCompany(gRouteList[a], gRouteList[b]); // Sort by Route first and than sort by company
  };

  let routeKeyList;
  const english = /^[A-Za-z]*$/;

  if (gRouteList) {
    if (route === "M" || route === "MT" || route === "MTR") {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].co.includes("mtr"))
        .filter(
          // Combine same route
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...gRouteList[e].stops.mtr].sort());
              const tStop = JSON.stringify([...gRouteList[t].stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else if (route.length === 3 && english.test(route) && route !== "MTR") {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].co.includes("mtr"))
        .filter(
          (e) =>
            route && route === gRouteList[e].route.substring(0, route.length)
        )
        .filter(
          // Combine same route
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...gRouteList[e].stops.mtr].sort());
              const tStop = JSON.stringify([...gRouteList[t].stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else {
      const routeLen = route ? route.length : 0;
      routeKeyList = Object.keys(gRouteList)
        .reduce((acc, key) => {
          const item = gRouteList[key];
          if (
            basicFiltering(item) &&
            route &&
            route === item.route.substring(0, routeLen)
          ) {
            acc.push(key);
          }
          return acc;
        }, [])
        .sort(
          (a, b) =>
            sortByRoute(a, b) || sortByCompany(gRouteList[a], gRouteList[b])
        );
    }
  }

  return routeKeyList?.length > 0 ? (
    <SimpleRouteList mode="search" routeKeyList={routeKeyList} />
  ) : (
    <div className="emptyMsg">請輸入路線</div>
  );
};
