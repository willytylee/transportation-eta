import { useState, useEffect } from "react";
import { etaTimeConverter } from "../../Utils";
import { fetchEtas } from "../../fetch/transports";

export const StopEta = ({
  seq,
  stopObj: {
    name,
    stopId,
    location: { lat, lng },
  },
  routeObj,
  isClosestStop,
}) => {
  const [eta, setEta] = useState([{ eta: "loading" }]);

  useEffect(() => {
    setEta([{ eta: "loading" }]);
    const intervalContent = async () => {
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

  return (
    <tr style={isClosestStop ? { backgroundColor: "lightblue" } : {}}>
      <td>{seq}</td>
      <td>
        <a
          href={`https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`}
          title={stopId}
        >
          {name.zh}
        </a>
      </td>
      {eta.length !== 0 ? (
        eta.map((e, i) => {
          return (
            <td key={i}>
              {etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr}
              {/* <br />
              {etaTimeConverter(e.eta, e.rmk_tc).remarkStr} */}
            </td>
          );
        })
      ) : (
        <td>沒有班次</td>
      )}
    </tr>
  );
};
