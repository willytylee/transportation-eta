import { useState, useEffect, useContext, useMemo } from "react";
import { Card, styled } from "@mui/material";
import { getLocalStorage, getActualCoIds } from "../../Utils";
import { companyMap } from "../../constants/Bus";
import { AppContext } from "../../context/AppContext";

export const RouteList = ({ route }) => {
  const [routeList, setRouteList] = useState([]);
  const { dbVersion, updateCurrRoute, currRoute } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const handleCardOnClick = (i) => {
    const expandRoute = routeList[i];
    updateCurrRoute(expandRoute);
  };

  const isMatchCurrRoute = (a, b) => {
    return (
      JSON.stringify(a.bound) === JSON.stringify(b.bound) &&
      JSON.stringify(a.co) === JSON.stringify(b.co) &&
      JSON.stringify(a.orig) === JSON.stringify(b.orig) &&
      JSON.stringify(a.dest) === JSON.stringify(b.dest) &&
      JSON.stringify(a.route) === JSON.stringify(b.route) &&
      JSON.stringify(a.seq) === JSON.stringify(b.seq)
    );
  };

  // When the route number is changed, update RouteList
  useEffect(() => {
    if (route) {
      const _routeList = Object.keys(gRouteList)
        .map((e) => gRouteList[e])
        .filter((e) => {
          return (
            e.route === route &&
            (e.co.includes("kmb") ||
              e.co.includes("nwfb") ||
              e.co.includes("ctb"))
          );
        })
        .sort(
          (a, b) => parseInt(a.serviceType, 10) - parseInt(b.serviceType, 10)
        );

      setRouteList(_routeList);
    } else {
      setRouteList([]);
      updateCurrRoute({});
    }
  }, [route]);

  return routeList.map((e, i) => {
    return (
      <Card
        key={i}
        onClick={() => handleCardOnClick(i)}
        sx={CardSx}
        variant="outlined"
      >
        <div
          className="routeTitle"
          style={
            isMatchCurrRoute(currRoute, e)
              ? { backgroundColor: "lightyellow" }
              : {}
          }
        >
          <div className="company">
            {getActualCoIds(e)
              .map((e) => companyMap[e])
              .join("+")}{" "}
          </div>
          <div className="origDest">
            {e.orig.zh} → <span className="dest">{e.dest.zh}</span>{" "}
            <span className="special">
              {" "}
              {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
            </span>
          </div>
        </div>
      </Card>
    );
  });
};

const CardSx = {
  margin: "4px",
  ".routeTitle": {
    padding: "4px",
    fontSize: "13px",
    display: "flex",
    float: "left",
    width: "100%",
    ".route": {
      width: "10%",
      fontWeight: "900",
    },
    ".company": {
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
      },
    },
  },
};
