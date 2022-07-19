import React from "react";
import { useState, useEffect } from "react";

import { etaTimeConverter } from "../../Utils";
import { fetchEtas } from "../../fetch";

export const StopEta = (props) => {
  const { stopName, seq, latLng, routeObj } = props;
  const [eta, setEta] = useState([]);

  useEffect(() => {
    setEta([]);

    const intervalContent = async () => {
      fetchEtas({ ...routeObj, seq: parseInt(seq, 10) }).then((response) =>
        setEta(response.slice(0, 3))
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
  }, [routeObj]);

  return (
    <tr>
      <td>
        {seq}.{" "}
        <a
          href={`https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`}
        >
          {stopName}
        </a>
      </td>
      {eta.length !== 0 ? (
        eta.map((e, i) => {
          return <td key={i}> {etaTimeConverter(e.eta, e.rmk_tc)} </td>;
        })
      ) : (
        <td>沒有班次</td>
      )}
    </tr>
  );
};
