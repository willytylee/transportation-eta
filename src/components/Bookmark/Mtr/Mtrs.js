import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { mtrLineColor, stationMap } from "../../../constants/Mtr";
import { fetchEtas } from "../../../fetch/transports";
import { parseMtrEtas } from "../../../Utils/Utils";
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
          const { route, stopId, dests } = section[i];
          const _sectionData = {};
          _sectionData.name = stationMap[stopId];
          _sectionData.dests = dests;
          _sectionData.route = route;
          dests.forEach((dest) => {
            // const boundKey = e.toUpperCase();
            const stationDataFiltered = stationData.filter(
              (f) => dest === f.dest
            );

            _sectionData[dest] = {
              // dest: stationDestMap[route][boundKey],
              dest,
              ttnts:
                stationDataFiltered.length > 0
                  ? stationDataFiltered.map((f) => parseMtrEtas(f))
                  : "",
            };
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
      <div className="dest">
        <span className={`${e.route}`}>{e.name}站</span>
      </div>
      <div className="etaGroupWrapper">
        {e.dests.map((f, j) => (
          <Table key={j} data={e} dests={f} />
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
