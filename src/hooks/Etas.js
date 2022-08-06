import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";

export const useEtas = ({ seq, routeObj, bound }) => {
  const [eta, setEta] = useState([{ eta: "loading" }]);

  useEffect(() => {
    setEta([{ eta: "loading" }]);
    const intervalContent = () => {
      bound
        ? fetchEtas({
            ...routeObj,
            seq: parseInt(seq, 10),
            bound,
          }).then((response) => setEta(response.slice(0, 3)))
        : fetchEtas({
            ...routeObj,
            seq: parseInt(seq, 10),
          }).then((response) => setEta(response.slice(0, 3)));
    };

    intervalContent();

    const interval = setInterval(intervalContent, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [routeObj, seq, bound]);

  return eta;
};
