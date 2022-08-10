import { useState, useEffect } from "react";
import { fetchNwfbCtbRouteStop } from "../fetch/transports/NwfbCtb";
import { getCoPriorityId } from "../Utils";

export const useCorrectBound = ({ currRoute }) => {
  const [scoreI, setScoreI] = useState(-1);
  const [scoreO, setScoreO] = useState(-1);
  const [isBoundLoading, setBoundLoading] = useState(true);

  useEffect(() => {
    setScoreI(-1);
    setScoreO(-1);
    const fetchRouteStop = async () => {
      if (Object.keys(currRoute).length !== 0) {
        const companyId = getCoPriorityId(currRoute);
        const expandStopIdArr = currRoute.stops[companyId];

        if (
          // Route = "IO" or "OI" in NWFB or CTB
          currRoute.bound[Object.keys(currRoute.bound)[0]].length > 1 &&
          (Object.keys(currRoute.stops)[0] === "nwfb" ||
            Object.keys(currRoute.stops)[0] === "ctb")
        ) {
          setBoundLoading(true);

          const StopsIPromise = fetchNwfbCtbRouteStop({
            ...currRoute,
            co: companyId,
            bound: "I",
          });

          const StopsOPromise = fetchNwfbCtbRouteStop({
            ...currRoute,
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

          for (let i = 1; i < Math.round(expandStopIdArr.length / 2); i++) {
            for (let j = 0; j < arrI.length - 1; j++) {
              if (
                expandStopIdArr[i - 1] === arrI[j - 1] &&
                expandStopIdArr[i] === arrI[j]
              ) {
                _scoreI++;
              }
            }
            for (let k = 0; k < arrO.length - 1; k++) {
              if (
                expandStopIdArr[i - 1] === arrO[k - 1] &&
                expandStopIdArr[i] === arrO[k]
              ) {
                _scoreO++;
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
  }, [currRoute]);

  return {
    isBoundLoading,
    correctBound:
      scoreI === -1 && scoreO === -1 ? undefined : scoreI > scoreO ? "I" : "O",
  };
};
