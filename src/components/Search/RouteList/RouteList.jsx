import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, styled } from "@mui/material";
import { basicFiltering, sortByCompany } from "../../../Utils/Utils";
import { EtaContext } from "../../../context/EtaContext";
import { mtrLineColor } from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";
import { TransportSign } from "../../Direction/Box/TransportSign";

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
        .filter(
          (e) => basicFiltering(gRouteList[e]) && gRouteList[e].route === route
        )
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
                <TransportSign routeObj={routeData} />
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
      ".companyOrigDest": {
        gap: "4px",
        alignItems: "center",
        width: "100%",
        display: "flex",
      },
      ".route": {
        fontWeight: "900",
        ...mtrLineColor,
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
});
