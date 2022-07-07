import moment from "moment";
import { etaTimeConverter, sortEtaObject } from "../../Utils";

export const List = (props) => {
  const { sectionData } = props;

  let fullArray = [];

  sectionData.forEach((item) => {
    const { etas, route, stopName, latLng } = item;

    let eta;

    if (etas.length === 0) {
      fullArray.push({
        route,
        eta: "",
        stopName,
        latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`,
      });
    } else {
      etas.forEach((item) => {
        item.eta ? (eta = item.eta) : (eta = "");
        const { rmk_tc } = item;
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

  fullArray.forEach((item, i) => {
    const { eta, rmk_tc } = item;
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
          {fullArray.map((item, i) => {
            return (
              <tr key={i}>
                <td className="route">{item?.route}</td>
                <td className="stopName">
                  <a href={item?.latLngUrl}>{item?.stopName}</a>
                </td>
                <td className="eta">{item?.eta}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
