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
        const promise = fetchEtas({ co: ["mtr"], route, stopId, bound });
        allPromises.push(promise);
      }

      const result = await Promise.all(allPromises);

      setSectionData(
        result.map((stationData, i) => {
          const { route, stopId, bound } = section[i];
          const _sectionData = {};
          _sectionData.name = stationMap[stopId];
          _sectionData.bound = bound;
          _sectionData.route = route;
          bound.forEach((e) => {
            const boundKey = e.toUpperCase();
            const stationDataFiltered = stationData.filter(
              (f) => e === f.bound
            );
            _sectionData[e] = {
              dest: stationDestMap[route][boundKey],
              ttnts:
                stationDataFiltered.length > 1
                  ? stationDataFiltered.map((e) =>
                      parseInt(e.ttnt) === 0
                        ? "準備埋站"
                        : parseInt(e.ttnt) >= 60
                        ? moment(e.eta, "YYYY-MM-DD HH:mm:ss").format("HH:ss")
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
        {e.bound.map((f, i) => (
          <Table key={i} data={e} bound={f} />
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
