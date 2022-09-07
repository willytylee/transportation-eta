import { useState, useContext } from "react";
import AsyncSelect from "react-select/async";
import proj4 from "proj4";
import { IconButton, styled } from "@mui/material";
import {
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { getPreciseDistance } from "geolib";
import { fetchLocation } from "../fetch/Location";
import { useStopIdsNearBy } from "../hooks/Stop";
import { DbContext } from "../context/DbContext";
import {
  basicFiltering,
  etaTimePhaser,
  getCoByStopObj,
  getCoPriorityId,
} from "../Utils/Utils";
import { useLocation } from "../hooks/Location";
import { SortingDialog } from "../components/SortingDialog";
import { Eta } from "../components/Search/RouteList/Eta";
import { routeMap } from "../constants/Mtr";
import { companyColor, companyMap } from "../constants/Constants";

export const Direction = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const [destLocation, setDestLocation] = useState({});
  const [etaDetail] = useState([]);
  const [sortingDialogOpen, setSortingDialogOpen] = useState(false);
  const { location: currentLocation } = useLocation({ time: 60000 });
  const { stopIdsNearby: origStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 600,
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });
  const { stopIdsNearby: destStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 600,
    lat: destLocation?.lat,
    lng: destLocation?.lng,
  });

  const getWalkTime = (meter) => Math.round(meter / 40);

  const handleEtaCallback = (i, response) => {
    const newEtaDetail = [...etaDetail];
    if (response.length > 0) {
      newEtaDetail[i] = etaTimePhaser(response[0].eta);
    }

    // setEtaDetail(newEtaDetail);
  };

  const loadOptions = async (input, callback) => {
    callback(
      await fetchLocation({ q: input }).then((response) =>
        response
          .filter(
            (e) =>
              e.addressZH
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(input.toLowerCase().replace(/\s/g, "")) ||
              e.nameZH
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(input.toLowerCase().replace(/\s/g, ""))
          )
          .map((e) => {
            const [lng, lat] = proj4(
              "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs",
              "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
              [e.x, e.y]
            );
            return {
              label: `${e.nameZH} - ${e.addressZH}`,
              value: `${e.nameZH} - ${e.addressZH}`,
              location: {
                lat,
                lng,
              },
            };
          })
      )
    );
  };

  const onChange = (e) => {
    setDestLocation(e?.location);
  };

  const routeList =
    gRouteList &&
    Object.keys(gRouteList)
      .map((e) => gRouteList[e])
      .filter((e) => basicFiltering(e));

  const filteredRouteList = [];

  origStopIdsNearby &&
    destStopIdsNearby &&
    routeList?.forEach((e) => {
      const company = getCoPriorityId(e);

      const filitedOrigStopId = Object.values(e.stops[company]).filter((f) =>
        Object.keys(origStopIdsNearby).includes(f)
      );

      const filitedDestStopId = Object.values(e.stops[company]).filter((f) =>
        Object.keys(destStopIdsNearby).includes(f)
      );

      if (filitedOrigStopId?.length > 0 && filitedDestStopId?.length > 0) {
        // There may have more than one destStopIdsNearby in a route, find the nearest stop in the route stop List
        const _origStopId = filitedOrigStopId.reduce((prev, curr) =>
          origStopIdsNearby[prev] < origStopIdsNearby[curr] ? prev : curr
        );

        const _destStopId = filitedDestStopId.reduce((prev, curr) =>
          destStopIdsNearby[prev] < destStopIdsNearby[curr] ? prev : curr
        );

        e.nearbyOrigStopId = _origStopId;
        e.nearbyDestStopId = _destStopId;

        e.nearbyOrigStopSeq =
          e.stops[company].findIndex((f) => f === _origStopId) + 1;
        e.nearbyDestStopSeq =
          e.stops[company].findIndex((f) => f === _destStopId) + 1;

        e.origWalkDistance = origStopIdsNearby[_origStopId];
        e.destWalkDistance = destStopIdsNearby[_destStopId];

        let duplicate = false;
        filteredRouteList.forEach((f) => {
          if (e.route === f.route) {
            duplicate = true;
          }
        });

        if (e.nearbyOrigStopSeq < e.nearbyDestStopSeq && !duplicate) {
          filteredRouteList.push(e);
        }
      }
    });

  const nearbyRouteList = filteredRouteList.map((e, j) => {
    const company = getCoPriorityId(e);

    let totalTransportDistance = 0;
    let actualTransportDistance = 0;
    for (let i = 0; i < e?.stops[company].length - 1; i += 1) {
      const stopId = e?.stops[company][i];
      const nextStopId = e?.stops[company][i + 1];
      const { location } = gStopList[stopId];
      const { location: nextLocation } = gStopList[nextStopId];

      const distance = getPreciseDistance(
        { latitude: location?.lat, longitude: location?.lng },
        { latitude: nextLocation?.lat, longitude: nextLocation?.lng }
      );

      totalTransportDistance += distance;

      if (i >= e.nearbyOrigStopSeq - 1 && i < e.nearbyDestStopSeq - 1) {
        actualTransportDistance += distance;
      }
    }

    return {
      ...e,
      origWalkTime: getWalkTime(e.origWalkDistance),
      destWalkTime: getWalkTime(e.destWalkDistance),
      transportTime: Math.round(
        e.jt * (actualTransportDistance / totalTransportDistance)
      ),
    };
  });

  const sortedRouteList = nearbyRouteList.sort(
    (a, b) =>
      a.origWalkTime +
      a.transportTime +
      a.destWalkTime -
      (b.origWalkTime + b.transportTime + b.destWalkTime)
  );

  return (
    <>
      <DirectionRoot>
        <div className="topBar">
          <AsyncSelect
            isClearable
            loadOptions={loadOptions}
            onChange={onChange}
            className="asyncSelect"
          />
          <IconButton onClick={() => setSortingDialogOpen(true)}>
            <SortIcon />
          </IconButton>
        </div>
        <div className="routeList">
          {sortedRouteList?.length > 0 &&
            sortedRouteList.map((e, i) => (
              <div key={i} className="routeItem">
                <div className="result">
                  <div className="left">
                    <div className="walkDistance">
                      {e.origWalkDistance <= 400 && <DirectionsWalkIcon />}
                      {e.origWalkDistance > 400 &&
                        e.origWalkDistance <= 600 && <DirectionsRunIcon />}
                      {e.origWalkTime}分鐘
                    </div>
                    →
                    <div className="company">
                      {getCoByStopObj(e)
                        .map((companyId, j) => (
                          <span key={j} className={companyId}>
                            {companyId !== "mtr" && companyMap[companyId]}
                            {companyId === "mtr" && (
                              <span className={`${e.route}`}>
                                {" "}
                                {routeMap[e.route]}
                              </span>
                            )}
                          </span>
                        ))
                        .reduce((a, b) => [a, " + ", b])}
                    </div>
                    <div className="route">{e.route} </div> →
                    <div className="walkDistance">
                      {e.destWalkDistance <= 400 && <DirectionsWalkIcon />}
                      {e.destWalkDistance > 400 &&
                        e.destWalkDistance <= 600 && <DirectionsRunIcon />}
                      {e.destWalkTime}分鐘
                    </div>
                  </div>
                  <div className="right">
                    {e.transportTime !== 0
                      ? `≈${
                          e.origWalkTime + e.transportTime + e.destWalkTime
                        }分鐘`
                      : ""}
                  </div>
                </div>
                <div>
                  <Eta
                    seq={e.nearbyOrigStopSeq}
                    routeObj={e}
                    slice={1}
                    callback={(response) => {
                      handleEtaCallback(i, response);
                    }}
                  />
                </div>
                <div className="detail">
                  <div className="walkDistance">
                    {e.origWalkDistance <= 400 && <DirectionsWalkIcon />}
                    {e.origWalkDistance > 400 && e.origWalkDistance <= 600 && (
                      <DirectionsRunIcon />
                    )}
                    {e.origWalkTime}分鐘
                  </div>
                  → <div>{gStopList[e.nearbyOrigStopId].name.zh}</div> →
                  <div>{e.nearbyDestStopSeq - e.nearbyOrigStopSeq}個站</div> →{" "}
                  <div>{gStopList[e.nearbyDestStopId].name.zh}</div> →
                  <div className="walkDistance">
                    {e.destWalkDistance <= 400 && <DirectionsWalkIcon />}
                    {e.destWalkDistance > 400 && e.destWalkDistance <= 600 && (
                      <DirectionsRunIcon />
                    )}
                    {e.destWalkTime}分鐘
                  </div>
                </div>
              </div>
            ))}
        </div>
      </DirectionRoot>
      <SortingDialog
        sortingDialogOpen={sortingDialogOpen}
        setSortingDialogOpen={setSortingDialogOpen}
      />
    </>
  );
};

const DirectionRoot = styled("div")({
  fontSize: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  height: "100%",
  ".topBar": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "14px",
    ".asyncSelect": {
      width: "100%",
    },
  },
  ".routeList": {
    overflow: "auto",
    ".routeItem": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "8px 10px",
      borderBottom: "1px solid lightgrey",
      gap: "4px",
      ".result": {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        ".left": {
          display: "flex",
          alignItems: "center",
          gap: "6px",
          ".company": {
            ...companyColor,
          },
          ".route": {
            fontWeight: 900,
          },
          ".walkDistance": {
            display: "flex",
            alignItems: "center",
            svg: { fontSize: "12px" },
          },
        },
        ".right": {
          display: "flex",
          gap: "12px",
        },
      },
      ".detail": {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: "4px",
        ".walkDistance": {
          display: "flex",
          alignItems: "center",
          svg: { fontSize: "12px" },
        },
      },
    },
  },
});
