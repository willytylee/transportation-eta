import { useState, useEffect } from "react";
import moment from "moment";
import { styled } from "@mui/material";
import {
  mtrLineColor,
  stationDestMap,
  stationMap,
} from "../../../constants/Mtr";
import { Table } from "./Table";
import { fetchEtas } from "../../../fetch/transports";

export const Mtrs = ({ section }) => {
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    setSectionData([]);

    const intervalContent = async () => {
      const allPromises = [];

      for (let i = 0; i < section.length; i++) {
        const { route, stopId, bound } = section[i];
        const promise = fetchEtas({ co: ["mtr"], route, stopId });
        allPromises.push(promise);
      }

      const result = await Promise.all(allPromises);

      setSectionData(
        result.map((e, i) => {
          const { route, stopId, bound } = section[i];
          const stationData = e[0];
          const _sectionData = {};
          _sectionData.name = stationMap[stopId];
          _sectionData.bound = bound;
          _sectionData.route = route;
          bound.forEach((e) => {
            const boundKey = e.toUpperCase();
            _sectionData[e] = {
              dest:
                stationData[boundKey].length > 1
                  ? stationMap[stationData[boundKey][0].dest]
                  : stationDestMap[route][boundKey],
              ttnts:
                stationData[boundKey].length > 1
                  ? stationData[boundKey].map((e) =>
                      parseInt(e.ttnt) === 0
                        ? "準備埋站"
                        : parseInt(e.ttnt) >= 60
                        ? moment(e.time, "YYYY-MM-DD HH:mm:ss").format("HH:ss")
                        : `${e.ttnt}分鐘`
                    )
                  : "",
            };
          });
          return _sectionData;
        })
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
  }, [section]);

  return sectionData.map((e, i) => (
    <MTRRoot key={i}>
      <div className="dest">
        <span className={`${e.route}`}>{e.name}站</span>
      </div>
      <div className="etaGroupWrapper">
        {e.bound.map((f) => (
          <Table data={e} bound={f} />
        ))}
      </div>
    </MTRRoot>
  ));
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
