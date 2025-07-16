import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";
import { getFirstCoByRouteObj } from "../Utils/Utils";

export const useEtas = ({ seq, routeObj, interval }) => {
  const [eta, setEta] = useState([]);
  const [isEtaLoading, setIsEtaLoading] = useState(true);

  useEffect(() => {
    setIsEtaLoading(true);
    const intervalContent = () => {
      const _routeObj = {
        ...routeObj,
        targetSeq: parseInt(seq, 10),
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

export const useEtas2 = ({ seq, routeObj, interval }) => {
  const [eta, setEta] = useState([]);
  const [isEtaLoading, setIsEtaLoading] = useState(true);

  useEffect(() => {
    // Single route, return no Etas for dest route
    if (Object.keys(routeObj).length === 0) {
      setEta([]);
      setIsEtaLoading(false);
      return;
    }

    setIsEtaLoading(true);

    const intervalContent = () => {
      let _routeObj;

      const co = getFirstCoByRouteObj(routeObj);
      if (co === "mtr") {
        _routeObj = {
          ...routeObj,
          bound: routeObj.bound.mtr,
          targetSeq: parseInt(seq, 10),
        };
      } else {
        _routeObj = {
          ...routeObj,
          targetSeq: parseInt(seq, 10),
        };
      }
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
