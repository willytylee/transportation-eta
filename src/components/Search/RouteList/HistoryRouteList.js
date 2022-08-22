import { SimpleRouteList } from "./SimpleRouteList";

export const HistoryRouteList = ({ handleRouteListItemOnClick }) => {
  const routeList = JSON.parse(localStorage.getItem("routeListHistory")) || [];

  return routeList.length > 0 ? (
    <SimpleRouteList
      routeList={routeList}
      handleRouteListItemOnClick={handleRouteListItemOnClick}
    />
  ) : (
    <div className="emptyMsg">未有歷史紀錄</div>
  );
};
