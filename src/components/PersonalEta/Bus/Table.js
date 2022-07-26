import { etaTimeConverter } from "../../../Utils";

export const Table = ({ sectionData }) => {
  const result = [];

  sectionData.forEach((e, i) => {
    const {
      etas,
      route,
      stopName,
      location: { lat, lng },
    } = e;

    result.push({
      route,
      etas:
        etas.length === 0
          ? ["沒有班次"]
          : etas
              .map((e) => {
                return etaTimeConverter(e.eta, e.rmk_tc).etaIntervalStr;
              })
              .slice(0, 3),
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
