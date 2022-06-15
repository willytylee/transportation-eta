import React, { useState, useEffect } from "react";
import axios from "axios";
import { constDest } from "./../../constants/MTRDests.js";

export const MTRs = (props) => {
  const { section } = props;
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    setSectionData([]);
    const interval = setInterval(async () => {
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

        sectionData.name = constDest[station];
        sectionData.direction = api.direction;
        sectionData.down = {
          dest:
            stationData.DOWN.length > 1
              ? constDest[stationData.DOWN[0].dest]
              : "",
          ttnts: stationData.DOWN.map((data) =>
            parseInt(data.ttnt) === 0
              ? "準備埋站"
              : parseInt(data.ttnt) >= 60
              ? "已停站"
              : `${data.ttnt}分鐘`
          ),
        };
        sectionData.up = {
          dest:
            stationData.UP.length > 1 ? constDest[stationData.UP[0].dest] : "",
          ttnts: stationData.UP.map((data) =>
            parseInt(data.ttnt) === 0
              ? "準備埋站"
              : parseInt(data.ttnt) >= 60
              ? "已停站"
              : `${data.ttnt}分鐘`
          ),
        };
        result.push(sectionData);
      }
      setSectionData(result);
    }, 1000);

    return () => clearInterval(interval);
  }, [section]);

  return (
    <>
      {sectionData.map((data, i) => {
        return (
          <div key={i}>
            <div>{data.name}站</div>
            {!data?.down?.dest && !data?.up?.dest ? "已停站" : null}
            <table className="mtrTable">
              <tbody>
                {data?.down?.dest && data.direction.includes("down") ? (
                  <tr>
                    <td>
                      往 <span className="dest">{data.down.dest}</span>{" "}
                      到站時間:
                    </td>
                    {data.down.ttnts
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
                {data?.up?.dest && data.direction.includes("up") ? (
                  <tr>
                    <td>
                      往 <span className="dest">{data.up.dest}</span> 到站時間:
                    </td>
                    {data.up.ttnts
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
          </div>
        );
      })}
    </>
  );
};
