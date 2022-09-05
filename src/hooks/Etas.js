import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";

export const useEtas = ({ seq, routeObj }) => {
  const [eta, setEta] = useState([]);
  const [isEtaLoading, setIsEtaLoading] = useState(true);

  useEffect(() => {
    setIsEtaLoading(true);
    const intervalContent = () => {
      const _routeObj = {
        ...routeObj,
        seq: parseInt(seq, 10),
      };
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
  }, [routeObj, seq]);

  return { eta, isEtaLoading };
};
