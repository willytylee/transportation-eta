import { useState, useEffect } from "react";
import { etaTimeConverter } from "../../Utils";
import { fetchEtas } from "../../fetch";

export const StopEta = ({
  stopName,
  seq,
  location: { lat, lng },
  routeObj,
  isClosestStop,
  bound,
}) => {
  const [eta, setEta] = useState([]);

  useEffect(() => {
    setEta([]);

    console.log(routeObj);

    const intervalContent = async () => {
      if (bound === "") {
        // Normal handling
        fetchEtas({ ...routeObj, seq: parseInt(seq, 10) }).then((response) =>
          setEta(response.slice(0, 3))
        );
      } else if (bound !== "") {
        // Special handling if manually insert bound
        fetchEtas({
          ...routeObj,
          seq: parseInt(seq, 10),
          bound: { [routeObj.co[0]]: bound }, // replace the IO / OI bound
        }).then((response) => setEta(response.slice(0, 3)));
      }
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
