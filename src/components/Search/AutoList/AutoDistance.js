import { useContext, useState, useEffect } from "react";
import _ from "lodash";
import { getPreciseDistance } from "geolib";
import { styled } from "@mui/material";
import { AppContext } from "../../../context/AppContext";
import { getCoByStopObj, basicFiltering } from "../../../Utils";
import { DbContext } from "../../../context/DbContext";
import { companyColor, companyMap } from "../../../constants/Constants";

export const AutoDistance = ({ route, handleItemOnClick }) => {
  const [autoList, setAutoList] = useState([]);
  const { location: currentLocation } = useContext(AppContext);
  const { gRouteList, gStopList } = useContext(DbContext);

  const sortByDistThenRoute = (a, b) => {
    const routeA = parseInt(a.route.replace(/\D/g, ""));
    const routeB = parseInt(b.route.replace(/\D/g, ""));

    return a.distance - b.distance || routeA - routeB; // Sort by distance first and than sort by Route
  };

  useEffect(() => {
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
          e.distance < 500 && (e.stopId.length === 6 || e.stopId.length === 16)
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

    const sortedRouteListNearBy = routeListNearBy.sort((a, b) =>
      sortByDistThenRoute(a, b)
    );

    setAutoList(
      _(sortedRouteListNearBy)
        .groupBy((x) => x.stopIdNearBy)
        .map((value, key) => ({ stopId: key, routes: value }))
        .value()
    );
  }, [route]);

  return (
    <>
      {autoList.length > 0 &&
        autoList.map((e, i) => {
          const name = gStopList[e.stopId].name.zh;
          const lat = gStopList[e.stopId].location.lat;
          const lng = gStopList[e.stopId].location.lng;
          return (
            <AutoDistanceRoot key={i}>
              <div className="stop">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`}
                >
                  {name} - {e.routes[0].distance}米
                </a>
              </div>
              <div className="routes">
                {e.routes.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="routeItems"
                      onClick={() => handleItemOnClick(e)}
                    >
                      <div className="company">
                        {getCoByStopObj(e)
                          .map((f, j) => {
                            return (
                              <span key={j} className={f}>
                                {companyMap[f]}
                              </span>
                            );
                          })
                          .reduce((a, b) => [a, " + ", b])}
                      </div>
                      <div className="route">{e.route}</div>
                      <div className="nearStopDest">
                        <div>
                          <span className="dest">{e.dest.zh}</span>
                          <span className="special">
                            {" "}
                            {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AutoDistanceRoot>
          );
        })}
    </>
  );
};

const AutoDistanceRoot = styled("div")({
  display: "flex",
  padding: "4px",
  flexDirection: "column",
  ".stop": {
    background: "#2f305c26",
    padding: "4px 10px",
  },
  ".routes": {
    padding: "0 10px",
    ".routeItems": {
      display: "flex",
      alignItems: "center",
      padding: "4px 0",
      borderBottom: "1px solid lightgrey",
      ".company": {
        ...companyColor,
        width: "20%",
      },
      ".route": {
        fontWeight: "900",
        letterSpacing: "-0.5px",
        width: "15%",
      },
      ".nearStopDest": {
        width: "65%",
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
  },
});
