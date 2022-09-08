import { useContext } from "react";
import { styled } from "@mui/material";
import { getCoByRouteObj } from "../../../Utils/Utils";
import { companyColor, companyMap } from "../../../constants/Constants";
import { EtaContext } from "../../../context/EtaContext";
import { etaExcluded, routeMap } from "../../../constants/Mtr";

export const SimpleRouteList = ({
  mode,
  routeList,
  handleRouteListItemOnClick,
}) => {
  const { route } = useContext(EtaContext);

  return routeList?.map((e, i) => (
    <SearchRouteListRoot
      onClick={() => handleRouteListItemOnClick(e)}
      key={i}
      className={`${route === e.route && mode === "search" && "match"}`}
    >
      <div className="route">
        {mode === "search" ? (
          <>
            <span className="boldRoute">
              {e.route.substring(0, route.length)}
            </span>
            {e.route.substring(route.length, e.route.length)}
          </>
        ) : (
          <span className="boldRoute">{e.route}</span>
        )}
      </div>
      <div className="companyOrigDest">
        <div className="company">
          {getCoByRouteObj(e)
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
    width: "40px",
    ".boldRoute": {
      fontWeight: 900,
    },
  },
  ".companyOrigDest": {
    display: "flex",
    flexDirection: "column",
    ".company": {
      ...companyColor,
    },

    ".origDest": {
      ".dest": {
        fontWeight: "900",
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
