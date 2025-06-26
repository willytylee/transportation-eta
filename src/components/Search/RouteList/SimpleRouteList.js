import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import { getCoIconByRouteObj } from "../../../Utils/Utils";
import { companyIconMap } from "../../../constants/Constants";
import { EtaContext } from "../../../context/EtaContext";
import {
  etaExcluded,
  mtrIconColor,
  mtrLineColor,
  routeMap,
} from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";

export const SimpleRouteList = ({ mode, routeKeyList }) => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);
  const navigate = useNavigate();

  return routeKeyList?.map((e, i) => {
    const routeData = gRouteList[e];
    return (
      <SearchRouteListRoot
        onClick={() => {
          navigate("/search/" + e, { replace: true });
        }}
        key={i}
        className={`${
          route === routeData.route && mode === "search" && "match"
        }`}
      >
        <div className="route">
          <div className="transportIconWrapper">
            <img
              className={`transportIcon ${routeData.route}`}
              src={companyIconMap[getCoIconByRouteObj(routeData)]}
              alt=""
            />
          </div>
          {mode === "search" ? (
            routeData.co[0] !== "mtr" ? (
              // highlight matched char
              <div>
                <span className="boldRoute">
                  {routeData.route.substring(0, route.length)}
                </span>
                {routeData.route.substring(
                  route.length,
                  routeData.route.length
                )}
              </div>
            ) : (
              // co === mtr, bold all
              <span className="boldRoute">{routeData.route}</span>
            )
          ) : (
            // mode === history
            <span className="boldRoute">{routeData.route}</span>
          )}
        </div>
        <div className="companyOrigDest">
          {routeData.co[0] === "mtr" && (
            <div className="routeWrapper">
              <div className={routeData.route}>{routeMap[routeData.route]}</div>
            </div>
          )}
          <div className="origDest">
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
      </SearchRouteListRoot>
    );
  });
};

const SearchRouteListRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "4px 10px",
  borderBottom: "1px solid lightgrey",
  "&.match": {
    background: "#ffffe5",
  },
  ".route": {
    width: "60px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    ".boldRoute": {
      fontWeight: 900,
    },
    ".transportIconWrapper": {
      display: "flex",
      ...mtrIconColor,
      ".transportIcon": {
        height: "18px",
      },
    },
  },

  ".companyOrigDest": {
    display: "flex",
    flexDirection: "column",
    ".routeWrapper": {
      ...mtrLineColor,
    },
    ".origDest": {
      ".dest": {
        fontWeight: "900",
        fontSize: "14px",
      },
      ".special": {
        fontSize: "10px",
      },
    },
    ".eta": {
      width: "15%",
      float: "left",
      fontSize: "10px",
    },
  },
});
