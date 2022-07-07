import PropTypes from "prop-types";
import { etaTimeConverter } from "../../Utils";

export const Table = (props) => {
  const { sectionData } = props;

  const txts = [];
  const result = [];

  sectionData.forEach((item, i) => {
    let { etas, route, stopName, latLng } = item;

    if (etas.length === 0) {
      txts[i] = ["沒有班次"];
    } else {
      txts[i] = etas.map((item) => {
        return etaTimeConverter(item.eta, item.rmk_tc);
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
          {result.map((item, i) => {
            return (
              <tr key={i}>
                <td className="route">{item.route}</td>
                <td className="stopName">
                  <a href={item.latLngUrl}>{item.stopName}</a>
                </td>
                {item.etas.map((item, j) => {
                  return (
                    <td key={j} className="eta">
                      {item}
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
