import { SimpleRouteList } from "./SimpleRouteList";

export const HistoryRouteList = ({ handleRouteListItemOnClick }) => {
  const routeList = JSON.parse(localStorage.getItem("routeListHistory")) || [];

  return (
    <SimpleRouteList
      routeList={routeList}
      handleRouteListItemOnClick={handleRouteListItemOnClick}
    />
  );
};
