import { useState, useEffect } from "react";
import { fetchEtas } from "../fetch/transports";

export const useEtas = ({ seq, routeObj }) => {
  const [eta, setEta] = useState([{ eta: "loading" }]);

  useEffect(() => {
    setEta([{ eta: "loading" }]);
    const intervalContent = () => {
      fetchEtas({
        ...routeObj,
        seq: parseInt(seq, 10),
      }).then((response) => setEta(response.slice(0, 3)));
    };

    intervalContent();

    const interval = setInterval(intervalContent, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [routeObj, seq]);

  return eta;
};
