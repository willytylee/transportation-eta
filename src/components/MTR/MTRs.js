import React, { useState, useEffect } from "react";
import axios from "axios";
import { apis } from "./../../APIs/mtrApis.js";
import { constDest } from "./../../constants/MTRDests.js";

export const MTRs = (props) => {
  const { id, direction } = props;
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const sectionData = {};
      const api = apis[id];
      const name = api.stop;
      const url = new URL(api.url);
      const lineSta = `${url.searchParams.get("line")}-${url.searchParams.get(
        "sta"
      )}`;
      const apiReturn = await axios.get(api.url);
      const stationData = apiReturn.data.data[lineSta];

      sectionData.name = name;
      sectionData.down = {
        dest:
          stationData.DOWN.length > 1
            ? constDest[stationData.DOWN[0].dest]
            : "",
        ttnts: stationData.DOWN.map((data) =>
          data.ttnt === "0" ? "準備埋站" : `${data.ttnt}分鐘`
        ),
      };
      sectionData.up = {
        dest:
          stationData.UP.length > 1 ? constDest[stationData.UP[0].dest] : "",
        ttnts: stationData.UP.map((data) =>
          data.ttnt === "0" ? "準備埋站" : `${data.ttnt}分鐘`
        ),
      };

      setSectionData(sectionData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>{sectionData.name}</div>
      {!sectionData?.down?.dest && !sectionData?.up?.dest ? "已停站" : null}
      <table className="mtrTable">
        <tbody>
          {sectionData?.down?.dest && direction.includes("down") ? (
            <tr>
              <td>
                往 <span className="dest">{sectionData.down.dest}</span>{" "}
                到站時間:
              </td>
              {sectionData.down.ttnts
                .map((ttnt, j) => (
                  <td className="ttnt" key={j}>
                    {ttnt}
                  </td>
                ))
                .slice(0, 3)}
            </tr>
          ) : null}
        </tbody>
      </table>
      <table className="mtrTable">
        <tbody>
          {sectionData?.up?.dest && direction.includes("up") ? (
            <tr>
              <td>
                往 <span className="dest">{sectionData.up.dest}</span> 到站時間:
              </td>
              {sectionData.up.ttnts
                .map((ttnt, j) => (
                  <td className="ttnt" key={j}>
                    {ttnt}
                  </td>
                ))
                .slice(0, 3)}
            </tr>
          ) : null}
        </tbody>
      </table>
    </>
  );
};
