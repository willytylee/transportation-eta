import { useContext, useState, useMemo, useEffect } from "react";
import { getPreciseDistance } from "geolib";
import { companyMap } from "../../constants/Bus";
import { AppContext } from "../../context/AppContext";
import { etaTimeConverter, getLocalStorage } from "../../Utils";
import { fetchEtas } from "../../fetch/transports";

export const AutoList = ({ route, setAnchorEl, setRoute }) => {
  const [autoList, setAutoList] = useState([]);
  const [autoListEta, setAutoListEta] = useState([]);
  const [title, setTitle] = useState("");
  const {
    dbVersion,
    location: currentLocation,
    updateCurrRoute,
  } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const gStopList = useMemo(() => {
    return getLocalStorage("stopList");
  }, [dbVersion]);

  const handleItemOnClick = (e) => {
    updateCurrRoute(e);
    setRoute(e.route);
    setAnchorEl(null);
  };

  const sortByRoute = (a, b) => {
    const routeA = parseInt(a.route.replace(/\D/g, ""));
    const routeB = parseInt(b.route.replace(/\D/g, ""));
    if (routeA < routeB) {
      return -1;
    }
    if (routeA > routeB) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    if (route) {
      setTitle("搜尋路線");

      setAutoList(
        Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => {
            return (
              route === e.route.substring(0, route.length) &&
              (e.co.includes("kmb") ||
                e.co.includes("nwfb") ||
                e.co.includes("ctb"))
            );
          })
          .sort((a, b) => sortByRoute(a, b))
      );

      setAutoListEta([]);
    } else {
      setTitle("附近路線");

      // Set Auto Complete Route List
      const stopIdsNearBy = Object.keys(gStopList)
        .map((e) => {
          const obj = gStopList[e];
          obj.stopId = e;
          return obj;
        })
        .filter((e) => {
          const distance = getPreciseDistance(
            { latitude: e.location.lat, longitude: e.location.lng },
            { latitude: currentLocation.lat, longitude: currentLocation.lng }
          );
          return (
            distance < 200 && (e.stopId.length === 6 || e.stopId.length === 16)
          );
        })
        .map((e) => e.stopId);

      const routeList = Object.keys(gRouteList)
        .map((e) => gRouteList[e])
        .filter(
          (e) =>
            e.co.includes("kmb") ||
            e.co.includes("nwfb") ||
            e.co.includes("ctb")
        );

      const _routeListNearBy = [];

      routeList.forEach((e) => {
        const arr1 = e.stops[e.co[0]];
        const arr2 = stopIdsNearBy;
        const res = arr1?.filter((item) => arr2.includes(item));
        if (res?.length > 0) {
          const obj = e;
          e.stopId = res[0];
          _routeListNearBy.push(obj);
        }
      });

      const _autoList = _routeListNearBy.sort((a, b) => sortByRoute(a, b));
      setAutoList(_autoList);

      // Set Auto Complete Route List ETA
      const intervalContent = async () => {
        setAutoListEta(
          await Promise.all(
            _autoList.map(async (e) => {
              return await fetchEtas({
                ...e,
                seq: null,
              });
            })
          )
        );
      };
      intervalContent();

      const interval = setInterval(intervalContent, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [route, currentLocation.lat, currentLocation.lng]);

  return (
    <div className="autoList">
      <div className="title">{title}</div>
      {autoList?.map((e, i) => {
        return (
          <div key={i} className="item" onClick={() => handleItemOnClick(e)}>
            <div className="routeCompany">
              <div className="route">{e.route}</div>
              <div className="company">
                {e.co.map((e) => companyMap[e]).join("+")}
              </div>
            </div>
            <div className="NearStopOrigDest" style={{ width: route && "85%" }}>
              {e.stopId && (
                <div className="StopNearBy">{gStopList[e.stopId].name.zh}</div>
              )}
              <div>
                {e.orig.zh} → <span className="dest">{e.dest.zh}</span>
                <span className="special">
                  {" "}
                  {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
                </span>
              </div>
            </div>
            <div className="eta" style={{ width: route && "0%" }}>
              {!route &&
                autoListEta[i]?.map((e, i) => {
                  return (
                    <div key={i}>
                      {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
