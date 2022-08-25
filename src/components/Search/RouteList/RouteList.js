import { useContext } from "react";
import { Card, styled } from "@mui/material";
import {
  getCoByStopObj,
  basicFiltering,
  sortByCompany,
  isMatchRoute,
  setRouteListHistory,
} from "../../../Utils/Utils";
import { EtaContext } from "../../../context/EtaContext";
import { companyMap, companyColor } from "../../../constants/Constants";
import { etaExcluded, routeMap } from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";

export const RouteList = () => {
  const { updateCurrRoute, currRoute, route } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);

  const routeList =
    gRouteList &&
    (route === "M" || route === "MT" || route === "MTR"
      ? Object.keys(gRouteList)
          .map((e) => gRouteList[e])
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
          .map((e) => gRouteList[e])
          .filter((e) => basicFiltering(e))
          .filter((e) => e.route === route)
          .sort((a, b) => sortByCompany(a, b)));

  const handleCardOnClick = (i) => {
    const expandRoute = routeList[i];
    updateCurrRoute(expandRoute);
    setRouteListHistory(expandRoute);
  };

  return routeList?.length > 0 ? (
    <RouteListRoot>
      {routeList?.map((e, i) => (
        <Card key={i} onClick={() => handleCardOnClick(i)}>
          <div
            title={JSON.stringify(e.route) + JSON.stringify(e.bound)}
            // There may have nearestStopId in one of the currRoute
            className={`routeTitle ${
              isMatchRoute(currRoute, e) ? "matched" : ""
            }`}
          >
            <div className="company">
              {getCoByStopObj(e)
                .map((companyId, j) => (
                  <span key={j} className={companyId}>
                    {companyId !== "mtr" && companyMap[companyId]}
                    {companyId === "mtr" && (
                      <span className={`${e.route}`}> {routeMap[e.route]}</span>
                    )}
                  </span>
                ))
                .reduce((a, b) => [a, " + ", b])}
            </div>
            <div className="origDest">
              {e.orig.zh}{" "}
              {e.co[0] === "mtr" ? (
                <> ←→ {e.dest.zh}</>
              ) : (
                <>
                  → <span className="dest">{e.dest.zh}</span>
                </>
              )}
              <span className="special">
                {" "}
                {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
                {etaExcluded.includes(e.route) && (
                  <span className="star">沒有相關班次資料</span>
                )}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </RouteListRoot>
  ) : (
    <div className="emptyMsg">請輸入路線</div>
  );
};

const RouteListRoot = styled("div")({
  marginBottom: "14px",
  ".MuiPaper-root": {
    margin: "2px 4px",
    boxShadow: "unset",
    border: "0.5px solid lightgrey",
    ".routeTitle": {
      padding: "4px",
      fontSize: "13px",
      display: "flex",
      float: "left",
      width: "100%",
      "&.matched": {
        backgroundColor: "#ffffe5",
      },
      ".route": {
        width: "10%",
        fontWeight: "900",
      },
      ".company": {
        ...companyColor,
        width: "20%",
      },
      ".origDest": {
        width: "80%",
        ".dest": {
          fontWeight: "900",
        },
        ".special": {
          fontSize: "10px",
          fontWeight: "normal",
          ".star": {
            fontWeight: "normal",
          },
        },
      },
    },
  },
});
