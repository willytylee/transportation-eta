import { useContext, useState, useEffect } from "react";
import { styled, IconButton } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { DbContext } from "../../context/DbContext";
import { buildRouteObjForEta } from "../../utils/Eta";
import { List } from "./List";
import { Table } from "./Table";

export const Category = ({ category }) => {
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

  const { gRouteList, gStopList } = useContext(DbContext);
  const [view, setView] = useState(viewInit);
  const [etaResult, setEtaResult] = useState([]);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const intervalContent = async () => {
      const categoryEtas = await buildRouteObjForEta(
        gStopList,
        gRouteList,
        category.data
      );
      setEtaResult(categoryEtas);
    };

    intervalContent();
    const interval = setInterval(intervalContent, 30000);

    return () => clearInterval(interval);
  }, [renderKey]);

  const handleSwitchBtnOnClick = () => {
    if (view === "table") {
      setView("list");
    } else if (view === "list") {
      setView("longList");
    } else if (view === "longList") {
      setView("table");
    }
  };

  const handleRefreshOnClick = () => {
    setRenderKey(renderKey + 1);
  };

  return (
    <CategoryRoot>
      <div className="header">
        <div className="categoryName">{category.title}</div>
        <div className="topBtnGroup">
          <div className="buttonWrapper">
            <button
              type="button"
              className="switchBtn"
              onClick={() => handleSwitchBtnOnClick(view)}
            >
              {view === "list" && "簡短班次排序"}
              {view === "longList" && "所有班次排序"}
              {view === "table" && "詳細路線班次"}
            </button>
          </div>
        </div>
        <div className="refreshWrapper">
          <IconButton className="iconBtn" onClick={handleRefreshOnClick}>
            <RefreshIcon />
          </IconButton>
        </div>
      </div>

      {view === "list" && <List etaResult={etaResult} longList={false} />}
      {view === "longList" && <List etaResult={etaResult} longList />}
      {view === "table" && <Table etaResult={etaResult} />}
    </CategoryRoot>
  );
};

const CategoryRoot = styled("div")({
  paddingTop: "3px",
  paddingBottom: "3px",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  ".header": {
    display: "grid",
    gridTemplateRows: "repeat(2, 0fr)",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "0",
    width: "100%",
    height: "100%",
    ".categoryName": {
      gridArea: "1 / 1 / 2 / 2",
      fontSize: "14px",
    },
    ".topBtnGroup": {
      gridArea: "2 / 1 / 3 / 2",
      ".buttonWrapper": {
        flex: 1,
        ".switchBtn": {
          borderRadius: "22px",
          color: "#2f305c",
          borderWidth: "0",
          padding: "2px 0",
          fontSize: "13px",
          margin: "2px 0",
          width: "145px",
          height: "22px",
        },
      },
    },
    ".refreshWrapper": {
      gridArea: "1 / 2 / 3 / 3",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  },
  ".expandBtn, .expandLessBtn": {
    padding: "3px",
    marginRight: "8px",
  },
});
