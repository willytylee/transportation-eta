import { useContext, useMemo } from "react";
import { getPreciseDistance } from "geolib";
import { DbContext } from "../context/DbContext";
import { useLocation } from "./Location";

export const useStopIdsNearBy = ({ maxDistance, lat, lng }) => {
  const { gStopList } = useContext(DbContext);
  const { location: currentLocation } = useLocation({ interval: 60000 });

  const stopIdsNearby = useMemo(
    // use useMemo prevent flicker on the list
    () =>
      gStopList && lat && lng
        ? Object.keys(gStopList)
            .map((e) => {
              const obj = gStopList[e];
              const distance = getPreciseDistance(
                { latitude: obj.location.lat, longitude: obj.location.lng },
                { latitude: lat, longitude: lng }
              );
              return { [e]: { distance } };
            })
            .filter((e) => {
              const value = Object.values(e)[0];
              return value.distance < maxDistance;
            })

            .reduce(
              (prev, curr) => ({
                ...prev,
                [Object.keys(curr)]: Object.values(curr)[0].distance,
              }),
              {}
            )
        : {},
    [currentLocation.lat, currentLocation.lng, lat, lng]
  );

  return { stopIdsNearby };
};
