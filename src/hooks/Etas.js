import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";

export const useEtas = ({ seq, routeObj, bound, isBoundLoading }) => {
  const [eta, setEta] = useState([]);
  const [isEtaLoading, setIsEtaLoading] = useState(true);

  useEffect(() => {
    setIsEtaLoading(true);
    const intervalContent = () => {
      const _routeObj = {
        ...routeObj,
        seq: parseInt(seq, 10),
      };
      if (bound) {
        _routeObj.bound = bound;
      }
      !isBoundLoading && // FetchEtas after finding correct bound!
        fetchEtas(_routeObj).then((response) => {
          setIsEtaLoading(false);
          setEta(response);
        });
    };

    intervalContent();

    const interval = setInterval(intervalContent, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [routeObj, seq, bound, isBoundLoading]);

  return { eta, isEtaLoading };
};
