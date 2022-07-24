import { etaTimeConverter, sortEtaObj } from "../../Utils";

export const List = ({ sectionData }) => {
  let fullArr = [];

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
      fullArr.push({
        route,
        eta: "",
        stopName,
        stopId,
        latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
      });
    } else {
      etas.forEach((e) => {
        e.eta ? (eta = e.eta) : (eta = "");
        const { rmk_tc } = e;
        fullArr.push({
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

  fullArr = sortEtaObj(fullArr);

  fullArr.forEach((e, i) => {
    const { eta, rmk_tc } = e;
    fullArr[i].eta = etaTimeConverter(eta, rmk_tc).etaIntervalStr;
  });

  if (sectionData.length >= 3) {
    fullArr = fullArr.slice(0, sectionData.length);
  } else {
    fullArr = fullArr.slice(0, 3);
  }

  return (
    <>
      <table className="listView">
        <tbody>
          {fullArr.map((e, i) => {
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
