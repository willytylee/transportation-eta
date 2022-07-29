import React, { useState, useEffect } from "react";
import { styled } from "@mui/material";
import axios from "axios";
import { stationMap } from "../../../constants/MTR";
import { Table } from "./Table";

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

  return sectionData.map((e, i) => {
    return (
      <div key={i}>
        <Dest>{e.name}站</Dest>
        {!e?.down?.dest && !e?.up?.dest && "已停站"}
        <Table data={e} dir="down" />
        <Table data={e} dir="up" />
      </div>
    );
  });
};

const Dest = styled("div")({
  fontSize: "12px",
});
