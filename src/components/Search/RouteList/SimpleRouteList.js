import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import { getCoIconByRouteObj } from "../../../Utils/Utils";
import { companyIconMap } from "../../../constants/Constants";
import { EtaContext } from "../../../context/EtaContext";
import { etaExcluded, mtrIconColor, mtrLineColor, routeMap } from "../../../constants/Mtr";

export const SimpleRouteList = ({ mode, routeList }) => {
  const { route } = useContext(EtaContext);
  const navigate = useNavigate();

  return routeList?.map((e, i) => (
    <SearchRouteListRoot
      onClick={() => {
        navigate("/search/" + e.key, { replace: true });
      }}
      key={i}
      className={`${route === e.route && mode === "search" && "match"}`}
    >
      <div className="route">
        <div className="transportIconWrapper">
          <img className={`transportIcon ${e.route}`} src={companyIconMap[getCoIconByRouteObj(e)]} alt="" />
        </div>
        {mode === "search" ? (
          e.co[0] !== "mtr" ? (
            // highlight matched char
            <div>
              <span className="boldRoute">{e.route.substring(0, route.length)}</span>
              {e.route.substring(route.length, e.route.length)}
            </div>
          ) : (
            // co === mtr, bold all
            <span className="boldRoute">{e.route}</span>
          )
        ) : (
          // mode === history
          <span className="boldRoute">{e.route}</span>
        )}
      </div>
      <div className="companyOrigDest">
        {e.co[0] === "mtr" && (
          <div className="routeWrapper">
            <div className={e.route}>{routeMap[e.route]}</div>
          </div>
        )}
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
            {etaExcluded.includes(e.route) && <span className="star">沒有相關班次資料</span>}
          </span>
        </div>
      </div>
    </SearchRouteListRoot>
  ));
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
