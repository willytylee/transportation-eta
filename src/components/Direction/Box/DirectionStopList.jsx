import { useContext, useState } from "react";
import { styled, Button } from "@mui/material";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { getFirstCoByRouteObj } from "../../../Utils/Utils";
import { DbContext } from "../../../context/DbContext";
import { mtrLineColor } from "../../../constants/Mtr";
import { companyColor } from "../../../constants/Constants";

export const DirectionStopList = ({
  routeObj,
  startStopSeq,
  endStopSeq,
  startStopId,
  endStopId,
  transportTime,
  updateFitBoundMode,
  fitBoundMode,
}) => {
  const { gStopList } = useContext(DbContext);
  const [stopList, setStopList] = useState([]);

  const handleStopListBtnOnClick = () => {
    if (stopList.length === 0) {
      const _stopList = [];
      for (let j = startStopSeq; j < endStopSeq - 1; j += 1) {
        _stopList.push(
          gStopList[routeObj.stops[getFirstCoByRouteObj(routeObj)][j]]
        );
      }
      setStopList(_stopList);
    } else {
      setStopList([]);
    }
  };

  const handleOnClick = () => {
    updateFitBoundMode(fitBoundMode);
  };

  return (
    <DirectionStopListRoot className="detailItem" onClick={handleOnClick}>
      <ul className="transportNotice">
        <li>{gStopList[startStopId].name.zh}</li>
        {endStopSeq - startStopSeq > 1 && (
          <div
            className="stopListBtn"
            type="button"
            onClick={handleStopListBtnOnClick}
          >
            <div
              className={
                routeObj.co[0] === "mtr"
                  ? `stop ${routeObj.route}`
                  : `${getFirstCoByRouteObj(routeObj)}`
              }
            >
              搭{endStopSeq - startStopSeq}個站
            </div>
            {stopList.length === 0 ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </div>
        )}
        <div
          className="stopList"
          style={stopList.length === 0 ? { display: "none" } : null}
        >
          {stopList.map((f, j) => (
            <li key={j}>{f.name.zh}</li>
          ))}
        </div>
        <li>{gStopList[endStopId].name.zh}</li>
      </ul>
      <div className="time">
        {transportTime !== null ? `${transportTime}分鐘` : "未能計算時間"}
      </div>
    </DirectionStopListRoot>
  );
};

const DirectionStopListRoot = styled(Button)({
  color: "rgba(0, 0, 0, 0.87)",
  ".transportNotice": {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    borderLeft: "3px solid",
    paddingLeft: "12px",
    margin: 0,
    alignItems: "flex-start",
    ".stopListBtn": {
      display: "flex",
      alignItems: "center",
      border: "none",
      padding: "0",
      background: "unset",
      fontSize: "12px",
      ...companyColor,
      ".stop": {
        ...mtrLineColor,
      },
    },
    ".stopList": {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      alignItems: "flex-start",
    },
  },
});
