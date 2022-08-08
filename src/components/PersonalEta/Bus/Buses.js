import { useState, useEffect } from "react";
import { styled } from "@mui/material";
import { Table } from "./Table.js";
import { List } from "./List.js";
import { fetchEtas } from "../../../fetch/transports";

export const Buses = ({ section, gStopList, gRouteList }) => {
  const [sectionData, setSectionData] = useState([]);
  const [view, setView] = useState("list");

  useEffect(() => {
    const intervalContent = async () => {
      const result = [];

      for (let i = 0; i < section.length; i++) {
        const { co, route, stopId, serviceType, seq } = section[i];
        const stopName = gStopList[stopId].name.zh;
        const { location } = gStopList[stopId];

        // Required field: route, company, seq and stopID
        const routeObj = Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => {
            return (
              e.route === route &&
              parseInt(e.serviceType) === (serviceType ? serviceType : 1) && // Default 1
              e.co.includes(co) &&
              e.stops[co][seq - 1] === stopId
            );
          })[0]; // Most likely, only one route will be found, so [0] is applied here

        if (routeObj) {
          const res = await fetchEtas({ ...routeObj, seq: parseInt(seq, 10) });
          result.push({
            etas: res,
            route,
            stopName,
            location,
            stopId,
          });
        }
      }

      setSectionData(result);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 5000);

    return () => clearInterval(interval);
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
      <button onClick={() => switchView(view)}>
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
