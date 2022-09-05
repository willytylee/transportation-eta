import { useState, useContext } from "react";
import AsyncSelect from "react-select/async";
import proj4 from "proj4";
import { styled } from "@mui/material";
import { fetchLocation } from "../fetch/Location";
import { useStopIdsNearBy } from "../hooks/Stop";
import { DbContext } from "../context/DbContext";
import { basicFiltering, getCoPriorityId } from "../Utils/Utils";
import { useLocation } from "../hooks/Location";

export const Direction = () => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const [destLocation, setDestLocation] = useState({});
  const { location: currentLocation } = useLocation({ time: 60000 });
  const { stopIdsNearby: origStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 500,
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });
  const { stopIdsNearby: destStopIdsNearby } = useStopIdsNearBy({
    maxDistance: 500,
    lat: destLocation.lat,
    lng: destLocation.lng,
  });

  const onChange = (e) => {
    setDestLocation(e?.location);
  };

  const loadOptions = async (input, callback) => {
    callback(
      await fetchLocation({ q: input }).then((response) =>
        response
          .filter(
            (e) =>
              e.addressZH.toLowerCase().includes(input.toLowerCase()) ||
              e.nameZH.toLowerCase().includes(input.toLowerCase())
          )
          .map((e) => {
            const [lng, lat] = proj4(
              "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs",
              "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
              [e.x, e.y]
            );
            return {
              label: `${e.nameZH} - ${e.addressZH}`,
              location: {
                lat,
                lng,
              },
            };
          })
      )
    );
  };

  const routeList =
    gRouteList &&
    Object.keys(gRouteList)
      .map((e) => gRouteList[e])
      .filter((e) => basicFiltering(e));

  const routeListNearby = [];

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

        e.origDistance = origStopIdsNearby[_origStopId];
        e.destDistance = destStopIdsNearby[_destStopId];

        if (e.nearbyOrigStopSeq < e.nearbyDestStopSeq) {
          routeListNearby.push(e);
        }
      }
    });

  const nearbyRouteList = routeListNearby
    .sort((a, b) => {
      const aSeqDiff = a.nearbyDestStopSeq - a.nearbyOrigStopSeq;
      const bSeqDiff = b.nearbyDestStopSeq - b.nearbyOrigStopSeq;
      return aSeqDiff - bSeqDiff;
    })
    .map((e) => e.route);

  return (
    <>
      <DirectionRoot>
        <AsyncSelect
          isClearable
          loadOptions={loadOptions}
          onChange={onChange}
        />
      </DirectionRoot>
      {nearbyRouteList?.length > 0 &&
        routeListNearby.map((e, i) => (
          <div key={i}>
            {e.route} {gStopList[e.nearbyOrigStopId].name.zh} →{" "}
            {gStopList[e.nearbyDestStopId].name.zh}
          </div>
        ))}
    </>
  );
};

const DirectionRoot = styled("div")({});
