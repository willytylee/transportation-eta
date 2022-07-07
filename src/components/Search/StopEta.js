import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  etaTimeConverter,
  getAllEtaUrlsFromKmb,
  sortEtaObject,
} from "../../Utils";

export const StopEta = (props) => {
  const { kmbStopId, route, stopName, seq, latLng, serviceType } = props;
  const [eta, setEta] = useState([]);

  useEffect(() => {
    setEta([]);

    const intervalContent = async () => {
      const urls = getAllEtaUrlsFromKmb(kmbStopId, route, serviceType);

      const fetchURL = (url) => axios.get(url);
      const promiseArray = urls.map(fetchURL);
      Promise.all(promiseArray).then((response) => {
        const parsedResponse = response.map((item) => {
          const data = item.data.data;
          return data.filter((item) => item.seq == seq);
        });
        const mergedEtas = parsedResponse
          .flat()
          .filter((item) => item != "" && item != null);

        setEta(sortEtaObject(mergedEtas).slice(0, 3));
      });
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
  }, [kmbStopId, route, seq]);

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
        eta.map((item, i) => {
          return <td key={i}> {etaTimeConverter(item.eta, item.rmk_tc)} </td>;
        })
      ) : (
        <td>沒有班次</td>
      )}
    </tr>
  );
};
