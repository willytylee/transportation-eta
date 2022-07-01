import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { etaTimeConverter } from "../utils/EtaUtils";

export const StopEta = (props) => {
  const { stopId, route, stopName, id } = props;
  const [eta, setEta] = useState([]);

  useEffect(() => {
    setEta([]);
    const interval = setInterval(async () => {
      axios
        .get(
          `https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/1`
        )
        .then((response) => {
          setEta(response.data.data);
        });
    }, 2000);
    return () => clearInterval(interval);
  }, [stopId, route]);

  return (
    <tr>
      <td>
        {id + 1}. {stopName}
      </td>
      {eta
        .filter((item) => {
          return item.seq === id + 1;
        })
        .map((data, i) => {
          return <td key={i}> {etaTimeConverter(data.eta)} </td>;
        })}
    </tr>
  );
};
