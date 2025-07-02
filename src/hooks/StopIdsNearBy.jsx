import { useContext, useMemo } from "react";
import { getDistance } from "geolib";
import { DbContext } from "../context/DbContext";

export const useStopIdsNearby = ({ maxDistance, lat, lng }) => {
  const { gStopList } = useContext(DbContext);

  const stopIdsNearby = useMemo(() => {
    // Early validation to avoid unnecessary computation
    if (
      !gStopList ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      !Number.isFinite(maxDistance)
    ) {
      return {};
    }

    const result = {};

    // Single pass: iterate over gStopList entries
    for (const [stopId, { location }] of Object.entries(gStopList)) {
      // Ensure location has valid lat/lng
      if (Number.isFinite(location?.lat) && Number.isFinite(location?.lng)) {
        const distance = getDistance(
          { latitude: location.lat, longitude: location.lng },
          { latitude: lat, longitude: lng }
        );
        // Only include stops within maxDistance
        if (distance < maxDistance) {
          result[stopId] = distance;
        }
      }
    }

    return result;
  }, [lat, lng, maxDistance]); // Include gStopList in dependencies

  return { stopIdsNearby };
};
