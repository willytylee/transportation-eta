import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";

export const useEtas = ({ seq, routeObj, interval }) => {
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

    const intervalID = setInterval(
      intervalContent,
      Math.random() * 10000 + interval - 5000
    );

    return () => {
      clearInterval(intervalID);
    };
  }, [routeObj, seq]);

  return { eta, isEtaLoading };
};
