import { useContext } from "react";
import { styled } from "@mui/material";
import { getCoByStopObj } from "../../../Utils";
import { companyColor, companyMap } from "../../../constants/Constants";
import { EtaContext } from "../../../context/EtaContext";

export const SimpleRouteList = ({
  mode,
  routeList,
  handleRouteListItemOnClick,
}) => {
  const { route } = useContext(EtaContext);

  return routeList.map((e, i) => (
    <SearchRouteListRoot onClick={() => handleRouteListItemOnClick(e)} key={i}>
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
          {getCoByStopObj(e)
            .map((f, j) => (
              <span key={j} className={f}>
                {companyMap[f]}
              </span>
            ))
            .reduce((a, b) => [a, " + ", b])}
        </div>
        <div className="origDest">
          <div>
            {e.orig.zh} → <span className="dest">{e.dest.zh}</span>
            <span className="special">
              {" "}
              {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
            </span>
          </div>
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
