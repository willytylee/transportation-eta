import { useContext } from "react";
import { useDebounce } from "use-debounce";
import { basicFiltering, sortByCompany } from "../../../utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { SimpleRouteList } from "./SimpleRouteList";

export const SearchRouteList = () => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);
  const [debouncedRoute] = useDebounce(route, 300);

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
    if (
      debouncedRoute === "M" ||
      debouncedRoute === "MT" ||
      debouncedRoute === "MTR"
    ) {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].co.includes("mtr"))
        .filter(
          // Combine same debouncedRoute
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...gRouteList[e].stops.mtr].sort());
              const tStop = JSON.stringify([...gRouteList[t].stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else if (
      debouncedRoute.length === 3 &&
      english.test(debouncedRoute) &&
      debouncedRoute !== "MTR"
    ) {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].co.includes("mtr"))
        .filter(
          (e) =>
            debouncedRoute &&
            debouncedRoute ===
              gRouteList[e].route.substring(0, debouncedRoute.length)
        )
        .filter(
          // Combine same debouncedRoute
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...gRouteList[e].stops.mtr].sort());
              const tStop = JSON.stringify([...gRouteList[t].stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else {
      const routeLen = debouncedRoute ? debouncedRoute.length : 0;
      routeKeyList = Object.keys(gRouteList)
        .reduce((acc, key) => {
          const item = gRouteList[key];
          if (
            basicFiltering(item) &&
            debouncedRoute &&
            debouncedRoute === item.route.substring(0, routeLen)
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
