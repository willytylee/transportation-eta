import { useState, useEffect } from "react";
import _ from "lodash";
import { styled } from "@mui/material";
import { mtrLineColor, stationMap } from "../../../constants/Mtr";
import { fetchEtas } from "../../../fetch/transports";
import { Table } from "./Table";

export const Mtrs = ({ section }) => {
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    const intervalContent = async () => {
      const allPromises = [];

      for (let i = 0; i < section.length; i += 1) {
        const { route, stopId } = section[i];
        const promise = fetchEtas({ co: ["mtr"], route, stopId });
        allPromises.push(promise);
      }

      const etas = await Promise.all(allPromises);

      setSectionData(
        etas.map((stationData, i) => {
          const groupedStationData = _(stationData)
            .groupBy((x) => x.bound)
            .map((value, key) => ({
              bound: key,
              etas: value,
            }))
            .value()
            .sort((a, b) => (a.dest > b.dest ? -1 : 1));

          const { route, stopId, bound } = section[i];
          const _sectionData = {};
          _sectionData.name = stationMap[stopId];
          _sectionData.route = route;
          _sectionData.ttns = [];

          groupedStationData
            .filter((e) => bound.includes(e.bound))
            .forEach((e) => {
              _sectionData.ttns.push(e.etas.length > 0 ? e.etas : "");
            });
          return _sectionData;
        })
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 10000);

    return () => clearInterval(interval);
  }, []);

  return sectionData.map((e, i) => (
    <MTRRoot key={i}>
      <div className="stop">
        <span className={`${e.route}`}>{e.name}</span>
      </div>
      <Table etasDetail={e.ttns} />
    </MTRRoot>
  ));
};

const MTRRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "6px",
  gap: "0",
  ".stop": {
    fontSize: "12px",
    width: "10%",
    ...mtrLineColor,
  },
});
