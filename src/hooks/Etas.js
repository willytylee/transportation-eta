import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";

export const useEtas = ({ seq, routeObj, bound, isBoundLoading }) => {
  const [eta, setEta] = useState([]);
  const [isEtaLoading, setIsEtaLoading] = useState(true);

  useEffect(() => {
    setIsEtaLoading(true);
    const intervalContent = () => {
      !isBoundLoading && // FetchEtas after finding correct bound!
        (bound
          ? fetchEtas({
              ...routeObj,
              seq: parseInt(seq, 10),
              bound,
            }).then((response) => {
              setIsEtaLoading(false);
              setEta(response.slice(0, 3));
            })
          : fetchEtas({
              ...routeObj,
              seq: parseInt(seq, 10),
            }).then((response) => {
              setIsEtaLoading(false);
              setEta(response.slice(0, 3));
            }));
    };

    intervalContent();

    const interval = setInterval(intervalContent, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [routeObj, seq, bound, isBoundLoading]);

  return { eta, isEtaLoading };
};
