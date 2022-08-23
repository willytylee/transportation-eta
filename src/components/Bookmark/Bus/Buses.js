import { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material";
import { fetchEtas } from "../../../fetch/transports";
import { DbContext } from "../../../context/DbContext";
import { Table } from "./Table";
import { List } from "./List";

// Works for KMB, NWFB, CTB and GMB
export const Buses = ({ section }) => {
  const { gStopList, gRouteList } = useContext(DbContext);
  const [sectionData, setSectionData] = useState([]);
  const [view, setView] = useState("list");

  useEffect(() => {
    const intervalContent = async () => {
      const allPromises = [];

      for (let i = 0; i < section.length; i += 1) {
        const { co, route, stopId, serviceType, seq, gtfsId } = section[i];

        // Required field: route, company, seq and stopID
        const routeObj = Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter(
            (e) =>
              (route ? e.route === route : true) && // For bus
              (gtfsId ? e.gtfsId === gtfsId : true) && // For Gmb
              parseInt(e.serviceType, 10) === (serviceType ? serviceType : 1) &&
              // Default 1
              e.co.includes(co) &&
              e.stops[co][seq - 1] === stopId
          )[0];
        // Even if there are more than one result, the ETAs should be the same,
        // so [0] can be applied here

        if (routeObj) {
          const promise = fetchEtas({ ...routeObj, seq: parseInt(seq, 10) });
          allPromises.push(promise);
        }
      }

      const etas = await Promise.all(allPromises);

      setSectionData(
        etas.map((e, i) => {
          const { route, stopId, co } = section[i];
          const stopName = gStopList[stopId].name.zh;
          const { location } = gStopList[stopId];
          return {
            etas: e,
            route,
            stopName,
            location,
            stopId,
            co,
          };
        })
      );
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const switchView = () => {
    if (view === "list") {
      setView("table");
    } else if (view === "table") {
      setView("list");
    }
  };

  return (
    <BusesRoot>
      <button type="button" onClick={() => switchView(view)}>
        {view === "list" ? "顯示所有班次" : "以到站時間排列"}
      </button>
      {view === "list" ? (
        <List sectionData={sectionData} />
      ) : (
        <Table sectionData={sectionData} />
      )}
    </BusesRoot>
  );
};

const BusesRoot = styled("div")({
  button: {
    borderRadius: "22px",
    color: "#136ac1",
    borderWidth: "0",
    padding: "2px 15px",
    fontSize: "12px",
    margin: "2px 0",
  },
});
