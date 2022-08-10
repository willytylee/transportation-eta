import { useContext, useState, useMemo, useEffect } from "react";
import { getPreciseDistance } from "geolib";
import { styled } from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { EtaContext } from "../../context/EtaContext";
import {
  getLocalStorage,
  getCoByStopObj,
  basicFiltering,
  sortByCompany,
} from "../../Utils";
import { companyColor, companyMap } from "../../constants/Constants";

export const AutoList = ({ route, setAnchorEl, setRoute, dbVersion }) => {
  const [autoList, setAutoList] = useState([]);
  const [title, setTitle] = useState("");
  const { location: currentLocation } = useContext(AppContext);
  const { updateCurrRoute } = useContext(EtaContext);

  const handleItemOnClick = (e) => {
    updateCurrRoute(e);
    setRoute(e.route);
    setAnchorEl(null);
  };

  const gRouteList = useMemo(() => getLocalStorage("routeList"), [dbVersion]);
  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);

  const sortByRouteThenCo = (a, b) => {
    let routeReturn = 0;
    if (a.route < b.route) {
      routeReturn = -1;
    }
    if (a.route > b.route) {
      routeReturn = 1;
    }

    return routeReturn || sortByCompany(a, b); // Sort by Route first and than sort by company
  };

  const sortByDistThenRoute = (a, b) => {
    const routeA = parseInt(a.route.replace(/\D/g, ""));
    const routeB = parseInt(b.route.replace(/\D/g, ""));

    return a.distance - b.distance || routeA - routeB; // Sort by distance first and than sort by Route
  };

  useEffect(() => {
    if (route) {
      setTitle("搜尋路線");

      setAutoList(
        Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => basicFiltering(e))
          .filter((e) => route === e.route.substring(0, route.length))
          .sort((a, b) => sortByRouteThenCo(a, b))
      );
    } else {
      setTitle("附近路線");

      // Set Auto Complete Route List
      const stopIdsNearBy = Object.keys(gStopList)
        .map((e) => {
          const obj = gStopList[e];
          const distance = getPreciseDistance(
            { latitude: obj.location.lat, longitude: obj.location.lng },
            { latitude: currentLocation.lat, longitude: currentLocation.lng }
          );
          obj.stopId = e;
          obj.distance = distance;
          return obj;
        })
        .filter((e) => {
          return (
            e.distance < 200 &&
            (e.stopId.length === 6 || e.stopId.length === 16)
          );
        })
        .map((e) => {
          return { [e.stopId]: e.distance };
        })
        .reduce(
          (prev, curr) => ({
            ...prev,
            [Object.keys(curr)]: Object.values(curr)[0],
          }),
          {}
        );

      const routeList = Object.keys(gRouteList)
        .map((e) => gRouteList[e])
        .filter((e) => basicFiltering(e));

      const routeListNearBy = [];

      // // Find out the route which contains the near by Stops
      routeList.forEach((e) => {
        const megredStpId = Object.values(e.stops)
          .map((e) => Object.values(e))
          .flat();

        const filitedStpId = megredStpId?.filter((e) => {
          return Object.keys(stopIdsNearBy).includes(e);
        });
        if (filitedStpId?.length > 0) {
          const obj = e;
          const stopId = filitedStpId[0]; // Can choose the first element, should be the same
          e.stopIdNearBy = stopId;
          e.distance = stopIdsNearBy[stopId];
          routeListNearBy.push(obj);
        }
      });

      setAutoList(routeListNearBy.sort((a, b) => sortByDistThenRoute(a, b)));
    }
  }, [route]);

  return (
    <AutoListRoot>
      <div className="title">{title}</div>
      {autoList?.map((e, i) => {
        return (
          <div key={i} className="item" onClick={() => handleItemOnClick(e)}>
            <div className="routeCompany">
              <div className="route">{e.route}</div>
              <div className="company">
                {getCoByStopObj(e)
                  .map((e, i) => {
                    return (
                      <span key={i} className={e}>
                        {companyMap[e]}
                      </span>
                    );
                  })
                  .reduce((a, b) => [a, " + ", b])}
              </div>
            </div>
            <div className="NearStopOrigDest">
              {e.stopIdNearBy ? (
                <>
                  <div className="StopNearBy">{e.distance}米</div>
                  <div>
                    {gStopList[e.stopIdNearBy].name.zh} →{" "}
                    <span className="dest">{e.dest.zh}</span>
                    <span className="special">
                      {" "}
                      {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  {e.orig.zh} → <span className="dest">{e.dest.zh}</span>
                  <span className="special">
                    {" "}
                    {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </AutoListRoot>
  );
};

const AutoListRoot = styled("div")({
  overflow: "auto",
  margin: "8px",
  fontSize: "12px",
  ".title": {
    textAlign: "center",
    fontWeight: "700",
    paddingBottom: "2px",
  },
  ".item": {
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderBottom: "1px solid lightgrey",
    ".routeCompany": {
      width: "20%",
      ".route": {
        fontWeight: "900",
      },
      ".company": {
        ...companyColor,
        fontSize: "10px",
      },
    },
    ".NearStopOrigDest": {
      width: "80%",
      float: "left",
      ".dest": {
        fontWeight: "900",
      },
    },
    ".eta": {
      width: "15%",
      float: "left",
      fontSize: "10px",
    },
  },
});
