import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import { getCoIconByRouteObj } from "../../../utils/Utils";
import { companyIconMap } from "../../../constants/Constants";
import { EtaContext } from "../../../context/EtaContext";
import { mtrIconColor, mtrLineColor, routeMap } from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";

export const SimpleRouteList = ({ mode, routeKeyList }) => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);
  const navigate = useNavigate();
  const routeLen = route ? route.length : 0;
  const handleOnClick = useCallback(
    (routeKey) => {
      navigate("/search/" + routeKey, { replace: true });
    },
    [navigate]
  );

  return routeKeyList?.map((key) => {
    const routeData = gRouteList[key];
    const { route: _route, co, orig, dest, serviceType } = routeData;
    const isMtr = co[0] === "mtr";
    const isLrt = co[0] === "lightRail";
    const isSearchMode = mode === "search";
    const isMatch = route === _route;
    const iconSrc = companyIconMap[getCoIconByRouteObj(routeData)];

    const renderRouteText = () => {
      if (isSearchMode && !isMtr) {
        return (
          <div>
            <span className="boldRoute">{_route.substring(0, routeLen)}</span>
            {_route.substring(routeLen)}
          </div>
        );
      }

      // isMtr or mode === history, bold all
      return (
        <span className={`boldRoute mtrRoute ${_route}`}>
          {routeMap[_route]}
          {!isMtr && _route}
        </span>
      );
    };

    return (
      <SimpleRouteListRoot
        onClick={() => handleOnClick(key)}
        key={key}
        className={isMatch && isSearchMode ? "match" : ""}
        isMtr={isMtr}
        mode={mode}
      >
        <div className="route">
          <div className="transportIconWrapper">
            <img
              className={`transportIcon ${isLrt ? "L" + _route : _route}`}
              src={iconSrc}
              alt=""
              loading="lazy"
            />
          </div>
          {renderRouteText()}
        </div>
        <div className="companyOrigDest">
          <div className="origDest">
            {orig.zh}{" "}
            {isMtr ? (
              <> ←→ {dest.zh}</>
            ) : (
              <>
                → <span className="dest">{dest.zh}</span>
              </>
            )}
            <span className="special">
              {" "}
              {parseInt(serviceType, 10) !== 1 && "特別班次"}
            </span>
          </div>
        </div>
      </SimpleRouteListRoot>
    );
  });
};

const SimpleRouteListRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "isMtr" && prop !== "mode",
})(({ isMtr, mode }) => ({
  display: "flex",
  alignItems: "center",
  padding: "4px 10px",
  borderBottom: "1px solid lightgrey",
  "&.match": {
    background: "#ffffe5",
  },
  ".route": {
    width: isMtr || mode === "history" ? "80px" : "60px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
    ".boldRoute": {
      fontWeight: 900,
    },
    ".transportIconWrapper": {
      display: "flex",
      ".transportIcon": {
        height: "18px",
        ...mtrIconColor,
      },
    },
    ".mtrRoute": {
      ...mtrLineColor,
    },
  },

  ".companyOrigDest": {
    display: "flex",
    flexDirection: "column",
    ".routeWrapper": {
      ".route": {
        ...mtrLineColor,
      },
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
}));
