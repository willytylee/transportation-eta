import { etaTimeConverter, sortEtaObj } from "../../../Utils";

export const List = ({ sectionData }) => {
  let result = [];

  sectionData.forEach((e) => {
    const {
      etas,
      route,
      stopName,
      location: { lat, lng },
      stopId,
    } = e;

    let eta;

    if (etas.length === 0) {
      result.push({
        route,
        eta: "",
        stopName,
        stopId,
        latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
      });
    } else {
      etas.forEach((e) => {
        eta = e.eta ? e.eta : "";
        const { rmk_tc } = e;
        result.push({
          route,
          eta,
          rmk_tc,
          stopName,
          stopId,
          latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
        });
      });
    }
  });

  // Sort the eta for same section

  result = sortEtaObj(result);

  result.forEach((e, i) => {
    const { eta, rmk_tc } = e;
    result[i].eta = etaTimeConverter(eta, rmk_tc).etaIntervalStr;
  });

  if (sectionData.length >= 3) {
    result = result.slice(0, sectionData.length);
  } else {
    result = result.slice(0, 3);
  }

  return (
    <>
      <table className="listView">
        <tbody>
          {result.map((e, i) => {
            return (
              <tr key={i}>
                <td className="route">{e?.route}</td>
                <td className="stopName">
                  <a href={e?.latLngUrl} title={e?.stopId}>
                    {e?.stopName}
                  </a>
                </td>
                <td className="eta">{e?.eta}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
