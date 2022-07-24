import { etaTimeConverter } from "../../Utils";

export const Table = ({ sectionData }) => {
  const txts = [];
  const result = [];

  sectionData.forEach((e, i) => {
    let {
      etas,
      route,
      stopName,
      location: { lat, lng },
    } = e;

    if (etas.length === 0) {
      txts[i] = ["沒有班次"];
    } else {
      txts[i] = etas.map((e) => {
        return etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr;
      });
    }
    result.push({
      route,
      etas: txts[i],
      stopName,
      latLngUrl: `https://www.google.com.hk/maps/search/?api=1&query=${lat},${lng}`,
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
