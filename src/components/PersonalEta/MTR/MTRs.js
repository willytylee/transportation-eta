import React, { useState, useEffect } from "react";
import axios from "axios";
import { stationMap } from "../../../constants/MTR";

export const MTRs = ({ section }) => {
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    setSectionData([]);

    const intervalContent = async () => {
      const result = [];

      for (let i = 0; i < section.length; i++) {
        const sectionData = {};
        const api = section[i];
        const url = new URL(api.url);
        const station = `${url.searchParams.get("sta")}`;
        const lineSta = `${url.searchParams.get("line")}-${url.searchParams.get(
          "sta"
        )}`;
        const apiReturn = await axios.get(api.url);
        const stationData = apiReturn.data.data[lineSta];

        sectionData.name = stationMap[station];
        sectionData.direction = api.direction;
        sectionData.down = {
          dest:
            stationData?.DOWN?.length > 1
              ? stationMap[stationData.DOWN[0].dest]
              : "",
          ttnts: stationData?.DOWN?.map((e) =>
            parseInt(e.ttnt) === 0
              ? "準備埋站"
              : parseInt(e.ttnt) >= 60
              ? "已停站"
              : `${e.ttnt}分鐘`
          ),
        };
        sectionData.up = {
          dest:
            stationData?.UP?.length > 1
              ? stationMap[stationData.UP[0].dest]
              : "",
          ttnts: stationData?.UP?.map((e) =>
            parseInt(e.ttnt) === 0
              ? "準備埋站"
              : parseInt(e.ttnt) >= 60
              ? "已停站"
              : `${e.ttnt}分鐘`
          ),
        };
        result.push(sectionData);
      }
      setSectionData(result);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
  }, [section]);

  return (
    <>
      {sectionData.map((e, i) => {
        return (
          <div key={i}>
            <div className="orig">{e.name}站</div>
            {!e?.down?.dest && !e?.up?.dest && "已停站"}
            <table className="mtrTable">
              <tbody>
                {e?.down?.dest && e.direction.includes("down") && (
                  <tr>
                    <td>
                      → <span className="dest">{e.down.dest}</span> 到站時間:
                    </td>
                    {e.down.ttnts
                      .map((e, j) => (
                        <td className="ttnt" key={j}>
                          {e}
                        </td>
                      ))
                      .slice(0, 3)}
                  </tr>
                )}
              </tbody>
            </table>
            <table className="mtrTable">
              <tbody>
                {e?.up?.dest && e.direction.includes("up") && (
                  <tr>
                    <td>
                      → <span className="dest">{e.up.dest}</span> 到站時間:
                    </td>
                    {e.up.ttnts
                      .map((e, j) => (
                        <td className="ttnt" key={j}>
                          {e}
                        </td>
                      ))
                      .slice(0, 3)}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
};
