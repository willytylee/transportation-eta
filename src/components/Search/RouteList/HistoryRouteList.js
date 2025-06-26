import { useContext } from "react";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { SimpleRouteList } from "./SimpleRouteList";

export const HistoryRouteList = () => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);

  let routeKeyList;
  const routeListHistory = localStorage.getItem("routeListHistory");

  try {
    JSON.parse(routeListHistory);
  } catch (error) {
    routeKeyList = [];
    localStorage.removeItem("routeListHistory");
  }

  if (Array.isArray(JSON.parse(routeListHistory))) {
    routeKeyList = JSON.parse(routeListHistory).filter((e) =>
      route ? route === gRouteList[e].route.substring(0, route.length) : true
    );
  } else {
    localStorage.removeItem("routeListHistory");
    routeKeyList = [];
  }

  return routeKeyList?.length > 0 ? (
    <SimpleRouteList mode="history" routeKeyList={routeKeyList} />
  ) : (
    <div className="emptyMsg">未有歷史紀錄</div>
  );
};
