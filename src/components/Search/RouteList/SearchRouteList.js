import { useContext } from "react";
import { basicFiltering, sortByCompany } from "../../../Utils";
import { DbContext } from "../../../context/DbContext";
import { SimpleRouteList } from "./SimpleRouteList";

export const SearchRouteList = ({ route, handleRouteListItemOnClick }) => {
  const { gRouteList } = useContext(DbContext);

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

  const routeList = Object.keys(gRouteList)
    .map((e) => gRouteList[e])
    .filter((e) => basicFiltering(e))
    .filter((e) => route && route === e.route.substring(0, route.length))
    .sort((a, b) => sortByRouteThenCo(a, b));

  return routeList.length > 0 ? (
    <SimpleRouteList
      routeList={routeList}
      handleRouteListItemOnClick={handleRouteListItemOnClick}
    />
  ) : (
    <div className="emptyMsg">請輸入路線</div>
  );
};
