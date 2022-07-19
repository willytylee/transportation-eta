import PropTypes from "prop-types";
import { etaTimeConverter } from "../../Utils";

export const Table = (props) => {
  const { sectionData } = props;

  const txts = [];
  const result = [];

  sectionData.forEach((e, i) => {
    let { etas, route, stopName, latLng } = e;

    if (etas.length === 0) {
      txts[i] = ["沒有班次"];
    } else {
      txts[i] = etas.map((e) => {
        return etaTimeConverter(e.eta, e.rmk_tc);
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
          {result.map((e, i) => {
            return (
              <tr key={i}>
                <td className="route">{e.route}</td>
                <td className="stopName">
                  <a href={e.latLngUrl}>{e.stopName}</a>
                </td>
                {e.etas.map((e, j) => {
                  return (
                    <td key={j} className="eta">
                      {e}
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
