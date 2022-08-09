import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import axios from "axios";
import { mtrLineColor, stationMap } from "../../../constants/Mtr";
import { Table } from "./Table";

export const Mtrs = ({ section }) => {
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    setSectionData([]);

    const intervalContent = async () => {
      const allPromises = [];

      for (let i = 0; i < section.length; i++) {
        const { line, station } = section[i];
        const promise = axios.get(
          `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${station}`
        );
        allPromises.push(promise);
      }

      const stationRes = await Promise.all(allPromises);

      setSectionData(
        stationRes.map((e, i) => {
          const { line, station, direction } = section[i];
          const lineSta = `${line}-${station}`;
          const stationData = e.data.data[lineSta];
          const _sectionData = {};
          _sectionData.name = stationMap[station];
          _sectionData.direction = direction;
          _sectionData.line = line;
          _sectionData.down = {
            dest:
              stationData?.DOWN?.length > 1
                ? stationMap[stationData.DOWN[0].dest]
                : "",
            ttnts: stationData?.DOWN?.map((e) =>
              parseInt(e.ttnt) === 0
                ? "準備埋站"
                : parseInt(e.ttnt) >= 60
                ? "沒有班次"
                : `${e.ttnt}分鐘`
            ),
          };
          _sectionData.up = {
            dest:
              stationData?.UP?.length > 1
                ? stationMap[stationData.UP[0].dest]
                : "",
            ttnts: stationData?.UP?.map((e) =>
              parseInt(e.ttnt) === 0
                ? "準備埋站"
                : parseInt(e.ttnt) >= 60
                ? "沒有班次"
                : `${e.ttnt}分鐘`
            ),
          };
          return _sectionData;
        })
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
  }, [section]);

  return sectionData.map((e, i) => {
    return (
      <MTRRoot key={i}>
        <div className="dest">
          <span className={`${e.line}`}>{e.name}站</span>
        </div>
        <div className="etaGroupWrapper">
          <Table data={e} dir="down" />
          <Table data={e} dir="up" />
        </div>
      </MTRRoot>
    );
  });
};

const MTRRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "4px 0",
  ".dest": {
    fontSize: "12px",
    width: "15%",
    ...mtrLineColor,
  },
  ".etaGroupWrapper": {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
});
