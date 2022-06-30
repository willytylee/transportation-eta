import moment from "moment";
import PropTypes from "prop-types";

export const Table = (props) => {
  const { sectionData } = props;

  const txts = [];
  const result = [];

  sectionData.forEach((routeData, i) => {
    let { etas, route, stopName, latLng } = routeData;
    etas = routeData.etas.map((data) => data.eta);

    if (etas.length === 0) {
      txts[i] = ["沒有班次"];
    } else {
      txts[i] = etas.map((eta) => {
        if (eta) {
          const minutesLeft = moment(eta).diff(moment(), "minutes");
          if (minutesLeft === 0) {
            return "準備埋站";
          } else if (minutesLeft < 0) {
            return "已埋站";
          }
          return `${minutesLeft}分鐘`;
        }
        return "沒有班次";
      });
    }
    result.push({
      route,
      etas: txts[i],
      stopName,
      latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`,
    });
  });

  return (
    <>
      <table className="tableView">
        <tbody>
          {result.map((routeData, i) => {
            return (
              <tr key={i}>
                <td className="route">{routeData.route}</td>
                <td className="stopName">
                  <a href={routeData.latLngUrl}>{routeData.stopName}</a>
                </td>
                {routeData.etas.map((eta, j) => {
                  return (
                    <td key={j} className="eta">
                      {eta}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

Table.propTypes = {
  sectionData: PropTypes.array,
};
