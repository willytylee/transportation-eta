import { useContext } from "react";
import { basicFiltering, sortByCompany } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { SimpleRouteList } from "./SimpleRouteList";

export const SearchRouteList = () => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);

  const sortByRouteThenCo = (a, b) => {
    let routeReturn = 0;
    if (a.route < b.route) {
      routeReturn = -1;
    }
    if (a.route > b.route) {
      routeReturn = 1;
    }

    return routeReturn || sortByCompany(a, b); // Sort by Route first and than sort by company
  };

  const routeList =
    gRouteList &&
    (route === "M" || route === "MT" || route === "MTR"
      ? Object.keys(gRouteList)
          .map((e) => {
            gRouteList[e].key = e;
            return gRouteList[e];
          })
          .filter((e) => e.co.includes("mtr"))
          .filter(
            // Combine same route
            (e, idx, self) =>
              idx ===
              self.findIndex((t) => {
                const eStop = JSON.stringify([...e.stops.mtr].sort());
                const tStop = JSON.stringify([...t.stops.mtr].sort());
                return eStop === tStop;
              })
          )
      : Object.keys(gRouteList)
          .map((e) => {
            gRouteList[e].key = e;
            return gRouteList[e];
          })
          .filter((e) => basicFiltering(e))
          .filter((e) => route && route === e.route.substring(0, route.length))
          .sort((a, b) => sortByRouteThenCo(a, b)));

  return routeList?.length > 0 ? <SimpleRouteList mode="search" routeList={routeList} /> : <div className="emptyMsg">請輸入路線</div>;
};
