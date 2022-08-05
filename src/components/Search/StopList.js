import { useState, useEffect, useMemo, useContext } from "react";
import { styled } from "@mui/material";
import { getPreciseDistance } from "geolib";
import { findCorrectBound, getLocalStorage } from "../../Utils";
import { AppContext } from "../../context/AppContext";
import { StopEta } from "./StopEta";
import { coPriority } from "../../constants/Bus";
import { fetchNwfbCtbRouteStop } from "../../fetch/transports/NwfbCtb";

export const StopList = ({ route }) => {
  const [stopList, setStopList] = useState([]);
  const [correctBound, setCorrectBound] = useState("");
  const {
    dbVersion,
    location: currentLocation,
    currRoute,
    nearestStopId,
    updateNearestStopId,
  } = useContext(AppContext);

  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);

  const getCoPriorityId = (currRoute) => {
    let companyId = "";
    for (let e of coPriority) {
      if (Object.keys(currRoute.stops).includes(e)) {
        companyId = e;
        break;
      }
    }
    return companyId;
  };

  // When the route number is changed
  useEffect(() => {
    setStopList([]);
  }, [route]);

  // When the currRoute in AppContext changed
  useEffect(() => {
    setCorrectBound("");

    if (Object.keys(currRoute).length !== 0) {
      // Find the company Id which appear in currRoute.stops

      const functionWrap = async () => {
        const companyId = getCoPriorityId(currRoute);
        const expandStopIdArr = currRoute.stops[companyId];

        if (
          currRoute.bound[Object.keys(currRoute.bound)[0]].length > 1 &&
          (Object.keys(currRoute.stops)[0] === "nwfb" ||
            Object.keys(currRoute.stops)[0] === "ctb")
        ) {
          const result = await findCorrectBound({
            expandStopIdArr,
            currRoute,
            companyId,
          });

          console.log([result.scoreI, result.scoreO]);
          setCorrectBound(result.scoreI > result.scoreO ? "I" : "O");
        }

        setStopList(
          expandStopIdArr.map((e) => ({ ...gStopList[e], stopId: e }))
        );

        updateNearestStopId(
          expandStopIdArr.reduce((prev, curr) => {
            const prevDistance = getPreciseDistance(
              {
                latitude: gStopList[prev].location.lat,
                longitude: gStopList[prev].location.lng,
              },
              {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }
            );
            const currDistance = getPreciseDistance(
              {
                latitude: gStopList[curr].location.lat,
                longitude: gStopList[curr].location.lng,
              },
              {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }
            );

            if (prevDistance < currDistance) {
              return prev;
            }
            return curr;
          })
        );
      };

      functionWrap();
    }
  }, [currRoute]);

  return (
    <StopListRoot>
      {Object.keys(currRoute).length !== 0 &&
        stopList?.map((e, i) => {
          const isNearestStop = gStopList[nearestStopId]?.name === e.name;
          return (
            <StopEta
              key={i}
              seq={i + 1}
              routeObj={currRoute}
              stopObj={e}
              isNearestStop={isNearestStop}
              bound={correctBound}
            />
          );
        })}
    </StopListRoot>
  );
};

const StopListRoot = styled("div")({
  width: "100%",
});
