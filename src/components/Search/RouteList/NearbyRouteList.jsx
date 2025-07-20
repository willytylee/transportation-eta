import { useContext } from "react";
import _ from "lodash";
import { basicFiltering } from "../../../utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { useLocationWithInterval } from "../../../hooks/Location";
import { StopGroupList } from "./Nearby/StopGroupList";

export const NearbyRouteList = ({ nearbyLocation }) => {
  const { gRouteList } = useContext(DbContext);
  const { route } = useContext(EtaContext);
  const { location: currentLocation } = useLocationWithInterval({
    interval: 60000,
  });

  const routeKeyList = Object.keys(gRouteList).filter(
    (e) =>
      basicFiltering(gRouteList[e]) &&
      route === gRouteList[e].route.substring(0, route.length)
  );

  const location = !_.isEmpty(nearbyLocation)
    ? nearbyLocation
    : currentLocation;

  return <StopGroupList routeKeyList={routeKeyList} location={location} />;
};
