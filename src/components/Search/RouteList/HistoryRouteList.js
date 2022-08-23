import { decompress as decompressJson } from "lzutf8-light";
import { SimpleRouteList } from "./SimpleRouteList";

export const HistoryRouteList = ({ handleRouteListItemOnClick }) => {
  let routeList;

  try {
    routeList = JSON.parse(
      decompressJson(localStorage.getItem("routeListHistory") || "W10=", {
        // "W10=" = compressed []
        inputEncoding: "Base64",
      })
    );
  } catch (error) {
    // Reset routeListHistory LocalStorage
    localStorage.removeItem("routeListHistory");
    routeList = [];
  }

  return routeList?.length > 0 ? (
    <SimpleRouteList
      mode="history"
      routeList={routeList}
      handleRouteListItemOnClick={handleRouteListItemOnClick}
    />
  ) : (
    <div className="emptyMsg">未有歷史紀錄</div>
  );
};
