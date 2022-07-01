import moment from "moment";
import { etaTimeConverter } from "../../utils/EtaUtils";

export const List = (props) => {
  const { sectionData } = props;

  let fullArray = [];

  sectionData.forEach((routeData) => {
    const { etas, route, stopName, latLng } = routeData;

    let eta;

    if (etas.length === 0) {
      fullArray.push({
        route,
        eta: "",
        stopName,
        latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`,
      });
    } else {
      etas.forEach((data) => {
        data.eta ? (eta = data.eta) : (eta = "");
        fullArray.push({
          route,
          eta,
          stopName,
          latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`,
        });
      });
    }
  });

  fullArray
    .sort((a, b) => {
      if (a.eta === "" || a.eta === null) {
        return 1;
      }
      if (b.eta === "" || b.eta === null) {
        return -1;
      }
      return moment(a.eta).diff(moment(b.eta), "second");
    })
    .forEach((routeData, i) => {
      const { eta } = routeData;
      fullArray[i].eta = etaTimeConverter(eta);
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
          {fullArray.map((data, i) => {
            return (
              <tr key={i}>
                <td className="route">{data?.route}</td>
                <td className="stopName">
                  <a href={data?.latLngUrl}>{data?.stopName}</a>
                </td>
                <td className="eta">{data?.eta}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
