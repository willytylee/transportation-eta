import { useContext, useState, useEffect } from "react";
import { styled } from "@mui/material";
import { DbContext } from "../../context/DbContext";
import { buildRouteObjForEta } from "../../Utils/Utils";
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
    const interval = setInterval(intervalContent, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSwitchBtnOnClick = () => {
    if (view === "table") {
      setView("list");
    } else if (view === "list") {
      setView("longList");
    } else if (view === "longList") {
      setView("table");
    }
  };

  return (
    <CategoryRoot>
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

      {view === "list" && <List etaResult={etaResult} longList={false} />}
      {view === "longList" && <List etaResult={etaResult} longList />}
      {view === "table" && <Table etaResult={etaResult} />}
    </CategoryRoot>
  );
};

const CategoryRoot = styled("div")({
  paddingTop: "6px",
  ".categoryName": {
    fontSize: "14px",
  },
  ".topBtnGroup": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    ".expandBtn, .expandLessBtn": {
      padding: "3px",
      marginRight: "8px",
    },
  },
});
