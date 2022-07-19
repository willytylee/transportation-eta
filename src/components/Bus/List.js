import { etaTimeConverter, sortEtaObject } from "../../Utils";

export const List = (props) => {
  const { sectionData } = props;

  let fullArray = [];

  sectionData.forEach((e) => {
    const { etas, route, stopName, latLng } = e;

    let eta;

    if (etas.length === 0) {
      fullArray.push({
        route,
        eta: "",
        stopName,
        latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`,
      });
    } else {
      etas.forEach((e) => {
        e.eta ? (eta = e.eta) : (eta = "");
        const { rmk_tc } = e;
        fullArray.push({
          route,
          eta,
          rmk_tc,
          stopName,
          latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`,
        });
      });
    }
  });

  // Sort the eta for same section

  fullArray = sortEtaObject(fullArray);

  fullArray.forEach((e, i) => {
    const { eta, rmk_tc } = e;
    fullArray[i].eta = etaTimeConverter(eta, rmk_tc);
  });

  if (sectionData.length >= 3) {
    fullArray = fullArray.slice(0, sectionData.length);
  } else {
    fullArray = fullArray.slice(0, 3);
  }

  return (
    <>
      <table className="listView">
        <tbody>
          {fullArray.map((e, i) => {
            return (
              <tr key={i}>
                <td className="route">{e?.route}</td>
                <td className="stopName">
                  <a href={e?.latLngUrl}>{e?.stopName}</a>
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
