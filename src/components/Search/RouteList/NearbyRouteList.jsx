import { useContext } from "react";
import { basicFiltering } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { EtaContext } from "../../../context/EtaContext";
import { useLocationWithInterval } from "../../../hooks/Location";
import { StopGroupList } from "./StopGroupList";

export const NearbyRouteList = () => {
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

  return (
    <StopGroupList
      routeKeyList={routeKeyList}
      currentLocation={currentLocation}
    />
  );
};
