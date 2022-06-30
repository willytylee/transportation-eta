import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { etaTimeConverter } from "./../utils/EtaUtils";

export const StopEta = (props) => {
  const { stopId, route, stopName } = props;
  const [eta, setEta] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <tr>
      <td>{stopName}</td>
      {eta.map((data, i) => {
        return <td key={i}> {etaTimeConverter(data.eta)} </td>;
      })}
    </tr>
  );
};
