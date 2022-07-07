import React, { useState, useEffect } from "react";
import axios from "axios";
import { constDest } from "../../constants/MTRDests";

export const MTRs = (props) => {
  const { section } = props;
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

        sectionData.name = constDest[station];
        sectionData.direction = api.direction;
        sectionData.down = {
          dest:
            stationData?.DOWN?.length > 1
              ? constDest[stationData.DOWN[0].dest]
              : "",
          ttnts: stationData?.DOWN?.map((item) =>
            parseInt(item.ttnt) === 0
              ? "準備埋站"
              : parseInt(item.ttnt) >= 60
              ? "已停站"
              : `${item.ttnt}分鐘`
          ),
        };
        sectionData.up = {
          dest:
            stationData?.UP?.length > 1
              ? constDest[stationData.UP[0].dest]
              : "",
          ttnts: stationData?.UP?.map((item) =>
            parseInt(item.ttnt) === 0
              ? "準備埋站"
              : parseInt(item.ttnt) >= 60
              ? "已停站"
              : `${item.ttnt}分鐘`
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
      {sectionData.map((item, i) => {
        return (
          <div key={i}>
            <div>{item.name}站</div>
            {!item?.down?.dest && !item?.up?.dest ? "已停站" : null}
            <table className="mtrTable">
              <tbody>
                {item?.down?.dest && item.direction.includes("down") ? (
                  <tr>
                    <td>
                      往 <span className="dest">{item.down.dest}</span>{" "}
                      到站時間:
                    </td>
                    {item.down.ttnts
                      .map((item, j) => (
                        <td className="ttnt" key={j}>
                          {item}
                        </td>
                      ))
                      .slice(0, 3)}
                  </tr>
                ) : null}
              </tbody>
            </table>
            <table className="mtrTable">
              <tbody>
                {item?.up?.dest && item.direction.includes("up") ? (
                  <tr>
                    <td>
                      往 <span className="dest">{item.up.dest}</span> 到站時間:
                    </td>
                    {item.up.ttnts
                      .map((item, j) => (
                        <td className="ttnt" key={j}>
                          {item}
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
