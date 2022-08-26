import { useState, useEffect, useContext } from "react";
import { styled, IconButton } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { fetchEtas } from "../../../fetch/transports";
import { DbContext } from "../../../context/DbContext";
import { Table } from "./Table";
import { List } from "./List";

// Works for KMB, NWFB, CTB and GMB
export const Buses = ({ section }) => {
  const bookmarkDisplay =
    JSON.parse(localStorage.getItem("settings"))?.bookmarkDisplay ||
    "簡短班次排序";

  let viewInit;

  switch (bookmarkDisplay) {
    case "所有班次排序":
      viewInit = "longList";
      break;

    case "詳細路線班次":
      viewInit = "table";
      break;

    default:
      viewInit = "list";
      break;
  }

  const [view, setView] = useState(viewInit);
  const { gStopList, gRouteList } = useContext(DbContext);
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    const intervalContent = async () => {
      const allPromises = [];

      for (let i = 0; i < section.length; i += 1) {
        const { co, route, stopId, seq, gtfsId } = section[i];

        // Required field: route, company, seq and stopID
        const routeObj = Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter(
            (e) =>
              (route ? e.route === route : true) && // For bus
              (gtfsId ? e.gtfsId === gtfsId : true) && // For Gmb
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
    const interval = setInterval(intervalContent, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const handleSwitchBtnOnClick = () => {
    if (view !== "table") {
      setView("table");
    } else if (bookmarkDisplay === "所有班次排序") {
      setView("longList");
    } else {
      setView("list");
    }
  };

  return (
    <BusesRoot>
      <div className="topBtnGroup">
        <button
          type="button"
          className="switchBtn"
          onClick={() => handleSwitchBtnOnClick(view)}
        >
          {view === "list" && "簡短班次排序"}
          {view === "longList" && "所有班次排序"}
          {view === "table" && "詳細路線班次"}
        </button>
        {view === "list" && (
          <IconButton
            className="expandBtn"
            onClick={() => {
              setView("longList");
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        )}
        {view === "longList" && (
          <IconButton
            className="expandLessBtn"
            onClick={() => {
              setView("list");
            }}
          >
            <ExpandLessIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      {view === "list" && <List sectionData={sectionData} longList={false} />}
      {view === "longList" && <List sectionData={sectionData} longList />}
      {view === "table" && <Table sectionData={sectionData} />}
    </BusesRoot>
  );
};

const BusesRoot = styled("div")({
  paddingTop: "6px",
  ".topBtnGroup": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ".switchBtn": {
      borderRadius: "22px",
      color: "#136ac1",
      borderWidth: "0",
      padding: "2px 0",
      fontSize: "13px",
      margin: "2px 0",
      width: "145px",
      height: "22px",
    },
  },
});
