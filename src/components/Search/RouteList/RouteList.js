import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, styled } from "@mui/material";
import { basicFiltering, sortByCompany, getCoIconByRouteObj } from "../../../Utils/Utils";
import { EtaContext } from "../../../context/EtaContext";
import { companyIconMap } from "../../../constants/Constants";
import { etaExcluded, mtrIconColor, mtrLineColor, routeMap } from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";

export const RouteList = () => {
  const { route } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);
  const { routeKey } = useParams();
  const navigate = useNavigate();

  const english = /^[A-Za-z]*$/;

  let routeList;

  if (gRouteList) {
    if (route === "M" || route === "MT" || route === "MTR") {
      routeList = Object.keys(gRouteList)
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
        );
    } else if (route.length === 3 && english.test(route) && route !== "MTR") {
      routeList = Object.keys(gRouteList)
        .map((e) => {
          gRouteList[e].key = e;
          return gRouteList[e];
        })
        .filter((e) => e.co.includes("mtr") && e.route === route)
        .filter(
          // Combine same route
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...e.stops.mtr].sort());
              const tStop = JSON.stringify([...t.stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else {
      routeList = Object.keys(gRouteList)
        .map((e) => {
          gRouteList[e].key = e;
          return gRouteList[e];
        })
        .filter((e) => basicFiltering(e))
        .filter((e) => e.route === route)
        .sort((a, b) => sortByCompany(a, b));
    }
  }

  const handleCardOnClick = (e) => {
    navigate("/search/" + e, { replace: true });
  };

  return routeList?.length > 0 ? (
    <RouteListRoot>
      {routeList?.map((e, i) => (
        <Card key={i} onClick={() => handleCardOnClick(e.key)}>
          <div
            // title={JSON.stringify(e.route) + JSON.stringify(e.bound)}
            // There may have nearestStopId in one of the currRoute
            className={`routeTitle ${e.key === routeKey ? "matched" : ""}`}
          >
            <div className="companyOrigDest">
              <div className="transportIconWrapper">
                <img className={`transportIcon ${e.route}`} src={companyIconMap[getCoIconByRouteObj(e)]} alt="" />
              </div>
              {e.co[0] === "mtr" && (
                <div className="routeWrapper">
                  <div className={e.route}>{routeMap[e.route]}</div>
                </div>
              )}
              <div>
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
                  {etaExcluded.includes(e.route) && <span className="star">沒有相關班次資料</span>}
                </span>
              </div>
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
      fontSize: "12px",
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
      ".companyOrigDest": {
        gap: "4px",
        alignItems: "center",
        width: "100%",
        display: "flex",
        ".routeWrapper": {
          ...mtrLineColor,
        },
        ".transportIconWrapper": {
          display: "flex",
          ...mtrIconColor,
          ".transportIcon": {
            height: "18px",
          },
        },
        ".dest": {
          fontWeight: "900",
          fontSize: "14px",
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
