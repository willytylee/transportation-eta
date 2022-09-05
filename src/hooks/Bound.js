// deprecated

import { useState, useEffect } from "react";
import { fetchNwfbCtbRouteStop } from "../fetch/transports/NwfbCtb";
import { getCoPriorityId } from "../Utils/Utils";

export const useCorrectBound = ({ routeObj }) => {
  const [scoreI, setScoreI] = useState(-1);
  const [scoreO, setScoreO] = useState(-1);
  const [isBoundLoading, setBoundLoading] = useState(true);

  useEffect(() => {
    setScoreI(-1);
    setScoreO(-1);
    const fetchRouteStop = async () => {
      if (routeObj && Object.keys(routeObj).length !== 0) {
        const companyId = getCoPriorityId(routeObj);
        const expandStopIdArr = routeObj.stops[companyId];

        if (
          // Route = "IO" or "OI" in NWFB or CTB
          routeObj.bound[Object.keys(routeObj.bound)[0]].length > 1 &&
          (Object.keys(routeObj.stops)[0] === "nwfb" ||
            Object.keys(routeObj.stops)[0] === "ctb")
        ) {
          setBoundLoading(true);

          const StopsIPromise = fetchNwfbCtbRouteStop({
            ...routeObj,
            co: companyId,
            bound: "I",
          });

          const StopsOPromise = fetchNwfbCtbRouteStop({
            ...routeObj,
            co: companyId,
            bound: "O",
          });

          const [StopsI, StopsO] = await Promise.all([
            StopsIPromise,
            StopsOPromise,
          ]);

          setBoundLoading(false);

          const arrI = StopsI.map((e) => e.stop);
          const arrO = StopsO.map((e) => e.stop);

          let _scoreI = 0;
          let _scoreO = 0;

          for (let i = 1; i < Math.round(expandStopIdArr.length / 2); i += 1) {
            for (let j = 0; j < arrI.length - 1; j += 1) {
              if (
                expandStopIdArr[i - 1] === arrI[j - 1] &&
                expandStopIdArr[i] === arrI[j]
              ) {
                _scoreI += 1;
              }
            }
            for (let k = 0; k < arrO.length - 1; k += 1) {
              if (
                expandStopIdArr[i - 1] === arrO[k - 1] &&
                expandStopIdArr[i] === arrO[k]
              ) {
                _scoreO += 1;
              }
            }
          }
          setScoreI(_scoreI);
          setScoreO(_scoreO);
        } else {
          setBoundLoading(false);
        }
      }
    };

    fetchRouteStop();
  }, [routeObj]);

  return {
    isBoundLoading,
    correctBound:
      scoreI === -1 && scoreO === -1 ? undefined : scoreI > scoreO ? "I" : "O",
  };
};
