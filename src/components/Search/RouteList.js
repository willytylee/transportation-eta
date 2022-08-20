import { useContext } from "react";
import { Card, styled } from "@mui/material";
import { getCoByStopObj, basicFiltering, sortByCompany } from "../../Utils";
import { EtaContext } from "../../context/EtaContext";
import { companyMap, companyColor } from "../../constants/Constants";
import { etaExcluded, routeMap } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";

export const RouteList = ({ route }) => {
  const { updateCurrRoute, currRoute } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);

  const routeList =
    gRouteList &&
    (route === "MTR"
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
  };

  const isMatchCurrRoute = (a, b) => {
    // There may have nearestStopId in one of the currRoute
    return (
      JSON.stringify(a.bound) === JSON.stringify(b.bound) &&
      JSON.stringify(a.co) === JSON.stringify(b.co) &&
      JSON.stringify(a.orig) === JSON.stringify(b.orig) &&
      JSON.stringify(a.dest) === JSON.stringify(b.dest) &&
      JSON.stringify(a.route) === JSON.stringify(b.route) &&
      JSON.stringify(a.seq) === JSON.stringify(b.seq) &&
      JSON.stringify(a.serviceType) === JSON.stringify(b.serviceType)
    );
  };

  return (
    <RouteListRoot>
      {routeList?.map((e, i) => {
        return (
          <Card key={i} onClick={() => handleCardOnClick(i)}>
            <div
              title={JSON.stringify(e.route) + JSON.stringify(e.bound)}
              className={`routeTitle ${
                isMatchCurrRoute(currRoute, e) ? "matched" : ""
              }`}
            >
              <div className="company">
                {getCoByStopObj(e)
                  .map((coCode, i) => {
                    return (
                      <span key={i}>
                        <span className={coCode}>
                          {coCode !== "mtr" && companyMap[coCode]}
                          {coCode === "mtr" && (
                            <span className={`${e.route}`}>
                              {" "}
                              {routeMap[e.route]}
                            </span>
                          )}
                        </span>
                      </span>
                    );
                  })
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
        );
      })}
    </RouteListRoot>
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
        backgroundColor: "lightyellow",
      },
      ".route": {
        width: "10%",
        fontWeight: "900",
        letterSpacing: "-0.5px",
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
