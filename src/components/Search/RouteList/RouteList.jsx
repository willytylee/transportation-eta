import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, styled } from "@mui/material";
import {
  basicFiltering,
  sortByCompany,
  getCoIconByRouteObj,
} from "../../../Utils/Utils";
import { EtaContext } from "../../../context/EtaContext";
import { companyIconMap } from "../../../constants/Constants";
import {
  etaExcluded,
  mtrIconColor,
  mtrLineColor,
  routeMap,
} from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";

export const RouteList = () => {
  const { route } = useContext(EtaContext);
  const { gRouteList } = useContext(DbContext);
  const { routeKey } = useParams();
  const navigate = useNavigate();

  const english = /^[A-Za-z]*$/;

  let routeKeyList;

  if (gRouteList) {
    if (route === "M" || route === "MT" || route === "MTR") {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].co.includes("mtr"))
        .filter(
          // Combine same route
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...gRouteList[e].stops.mtr].sort());
              const tStop = JSON.stringify([...gRouteList[t].stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else if (route.length === 3 && english.test(route) && route !== "MTR") {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].co.includes("mtr"))
        .filter(
          (e) =>
            gRouteList[e].co.includes("mtr") && gRouteList[e].route === route
        )
        .filter(
          // Combine same route
          (e, idx, self) =>
            idx ===
            self.findIndex((t) => {
              const eStop = JSON.stringify([...gRouteList[e].stops.mtr].sort());
              const tStop = JSON.stringify([...gRouteList[t].stops.mtr].sort());
              return eStop === tStop;
            })
        );
    } else {
      routeKeyList = Object.keys(gRouteList)
        .filter((e) => basicFiltering(gRouteList[e]))
        .filter((e) => gRouteList[e].route === route)
        .sort((a, b) => sortByCompany(gRouteList[a], gRouteList[b]))
        .filter((e) => {
          if (routeKey) {
            return (
              gRouteList[routeKey].co.sort().join() ===
              gRouteList[e].co.sort().join()
            );
          }
          return true;
        });
    }
  }

  const handleCardOnClick = (e) => {
    navigate("/search/" + e, { replace: true });
  };

  return routeKeyList?.length > 0 ? (
    <RouteListRoot>
      {routeKeyList?.map((e, i) => {
        const routeData = gRouteList[e];
        return (
          <Card key={i} onClick={() => handleCardOnClick(e)}>
            <div
              // There may have nearestStopId in one of the currRoute
              className={`routeTitle ${e === routeKey ? "matched" : ""}`}
            >
              <div className="companyOrigDest">
                <div className="transportIconWrapper">
                  <img
                    className={`transportIcon ${routeData.route}`}
                    src={companyIconMap[getCoIconByRouteObj(routeData)]}
                    alt=""
                  />
                </div>
                {routeData.co[0] === "mtr" && (
                  <div className="routeWrapper">
                    <div className={routeData.route}>
                      {routeMap[routeData.route]}
                    </div>
                  </div>
                )}
                <div>
                  {routeData.orig.zh}{" "}
                  {routeData.co[0] === "mtr" ? (
                    <> ←→ {routeData.dest.zh}</>
                  ) : (
                    <>
                      → <span className="dest">{routeData.dest.zh}</span>
                    </>
                  )}
                  <span className="special">
                    {" "}
                    {parseInt(routeData.serviceType, 10) !== 1 && "特別班次"}
                    {etaExcluded.includes(routeData.route) && (
                      <span className="star">沒有相關班次資料</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
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
