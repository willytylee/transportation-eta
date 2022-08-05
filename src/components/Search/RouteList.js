import { useState, useEffect, useContext, useMemo } from "react";
import { Card, styled } from "@mui/material";
import { getLocalStorage, getActualCoIds } from "../../Utils";
import { companyMap } from "../../constants/Bus";
import { AppContext } from "../../context/AppContext";

export const RouteList = ({ route }) => {
  const [routeList, setRouteList] = useState([]);
  const { dbVersion, updateCurrRoute, currRoute } = useContext(AppContext);

  const gRouteList = useMemo(() => getLocalStorage("routeList"), [dbVersion]);

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
      setRouteList(
        Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => {
            return (
              (e.co.includes("kmb") ||
                e.co.includes("nwfb") ||
                e.co.includes("ctb") ||
                e.co.includes("mtr")) &&
              e.route === route &&
              e.dest.en !== e.orig.en &&
              e.dest.zh !== e.orig.zh
            );
          })
          .sort(
            (a, b) => parseInt(a.serviceType, 10) - parseInt(b.serviceType, 10)
          )
      );
    } else {
      setRouteList([]);
      updateCurrRoute({});
    }
  }, [route]);

  return routeList.map((e, i) => {
    return (
      <RouteListRoot
        key={i}
        onClick={() => handleCardOnClick(i)}
        variant="outlined"
      >
        <div
          title={JSON.stringify(e.bound)}
          className={`routeTitle ${
            isMatchCurrRoute(currRoute, e) ? "matched" : ""
          }`}
        >
          <div className="company">
            {getActualCoIds(e)
              .map((e, i) => {
                return (
                  <span key={i} className={e}>
                    {companyMap[e]}
                  </span>
                );
              })
              .reduce((a, b) => [a, " + ", b])}
          </div>
          <div className="origDest">
            {e.orig.zh} → <span className="dest">{e.dest.zh}</span>{" "}
            <span className="special">
              {" "}
              {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
            </span>
          </div>
        </div>
      </RouteListRoot>
    );
  });
};

const RouteListRoot = styled(Card)({
  margin: "4px",
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
    },
    ".company": {
      width: "20%",
      ".kmb": {
        color: "#DD1E2F",
      },
      ".nwfb": {
        color: "#857700",
      },
      ".ctb": {
        color: "#6A42A7",
      },
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
});
