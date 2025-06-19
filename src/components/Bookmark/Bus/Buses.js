import { useState, useEffect, useContext } from "react";
import { styled, IconButton } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DepartureBoard as DepartureBoardIcon,
  DepartureBoardOutlined as DepartureBoardOutlinedIcon,
} from "@mui/icons-material";
import { DbContext } from "../../../context/DbContext";
import { fetchBusEta } from "../../../Utils/Utils";
import { Table } from "./Table";
import { List } from "./List";

// Works for KMB, NWFB, CTB and GMB
export const Buses = ({ section, categoryKey, sectionKey }) => {
  const bookmarkDisplay = JSON.parse(localStorage.getItem("settings"))?.bookmarkDisplay || "簡短班次排序";

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

  const { gStopList, gRouteList } = useContext(DbContext);
  const [view, setView] = useState(viewInit);
  const [sectionData, setSectionData] = useState([]);
  const [stationBtnOn, setStationBtnOn] = useState(false);

  useEffect(() => {
    const stationMode = JSON.parse(localStorage.getItem("stationMode")) || [];

    if (stationMode.find((item) => item.position[0] === categoryKey && item.position[1] === sectionKey)) {
      setStationBtnOn(true);
    }

    const intervalContent = async () => {
      const etas = await fetchBusEta(gStopList, gRouteList, section);
      setSectionData(etas);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSwitchBtnOnClick = () => {
    if (view !== "table") {
      setView("table");
    } else if (bookmarkDisplay === "所有班次排序") {
      setView("longList");
    } else {
      setView("list");
    }
  };

  const handleStationBtnOnClick = () => {
    const stationMode = JSON.parse(localStorage.getItem("stationMode")) || [];
    if (stationMode.find((item) => item.position[0] === categoryKey && item.position[1] === sectionKey)) {
      const data = stationMode.filter((item) => !(item.position[0] === categoryKey && item.position[1] === sectionKey));
      localStorage.setItem("stationMode", JSON.stringify(data));
      setStationBtnOn(false);
    } else {
      const data = [
        ...stationMode,
        {
          title: gStopList[section[0].stopId].name.zh,
          position: [categoryKey, sectionKey],
        },
      ];
      setStationBtnOn(true);
      localStorage.setItem("stationMode", JSON.stringify(data));
    }
  };

  return (
    <BusesRoot>
      <div className="topBtnGroup">
        <div className="buttonWrapper">
          <button type="button" className="switchBtn" onClick={() => handleSwitchBtnOnClick(view)}>
            {view === "list" && "簡短班次排序"}
            {view === "longList" && "所有班次排序"}
            {view === "table" && "詳細路線班次"}
          </button>
        </div>
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
        <IconButton onClick={() => handleStationBtnOnClick()}>
          {stationBtnOn ? <DepartureBoardIcon fontSize="small" /> : <DepartureBoardOutlinedIcon fontSize="small" color="disabled" />}
        </IconButton>
      </div>

      {view === "list" && <List section={section} sectionData={sectionData} longList={false} />}
      {view === "longList" && <List section={section} sectionData={sectionData} longList />}
      {view === "table" && <Table section={section} sectionData={sectionData} />}
    </BusesRoot>
  );
};

const BusesRoot = styled("div")({
  paddingTop: "6px",
  ".topBtnGroup": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ".buttonWrapper": {
      flex: 1,
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
    ".expandBtn, .expandLessBtn": {
      padding: "3px",
      marginRight: "8px",
    },
  },
});
