import { useState, useEffect } from "react";
import { etaTimeConverter } from "../../Utils";
import { fetchEtas } from "../../fetch";

export const StopEta = ({
  seq,
  stopObj: {
    name,
    stopId,
    location: { lat, lng },
  },
  routeObj,
  isClosestStop,
  bound,
}) => {
  const [eta, setEta] = useState([]);

  useEffect(() => {
    const intervalContent = async () => {
      fetchEtas({
        ...routeObj,
        seq: parseInt(seq, 10),
        bound: bound !== "" ? { [routeObj.co[0]]: bound } : "",
      }).then((response) => setEta(response.slice(0, 3)));
    };

    intervalContent();

    const interval = setInterval(intervalContent, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [routeObj, seq, bound]);

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
          return <td key={i}> {etaTimeConverter(e.eta, e.rmk_tc)} </td>;
        })
      ) : (
        <td>沒有班次</td>
      )}
    </tr>
  );
};
