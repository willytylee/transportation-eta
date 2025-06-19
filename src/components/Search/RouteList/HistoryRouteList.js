import { useContext } from "react";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { SimpleRouteList } from "./SimpleRouteList";

export const HistoryRouteList = () => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);

  let routeList;

  try {
    JSON.parse(localStorage.getItem("routeListHistory"));
  } catch (error) {
    routeList = [];
    localStorage.removeItem("routeListHistory");
  }

  if (Array.isArray(JSON.parse(localStorage.getItem("routeListHistory")))) {
    const routeListHistory = JSON.parse(localStorage.getItem("routeListHistory"));
    routeList = routeListHistory.map((e) => gRouteList[e]).filter((e) => (route ? route === e.route.substring(0, route.length) : true));
  } else {
    localStorage.removeItem("routeListHistory");
    routeList = [];
  }

  return routeList?.length > 0 ? <SimpleRouteList mode="history" routeList={routeList} /> : <div className="emptyMsg">未有歷史紀錄</div>;
};
