import { useContext, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";
import {
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import {
  companyColor,
  companyIconMap,
  primaryColor,
} from "../../constants/Constants";
import { mtrIconColor } from "../../constants/Mtr";
import {
  getCoByRouteObj,
  getCoIconByRouteObj,
  getCoPriorityId,
  phaseEtaToTime,
  phaseEtaToWaitingMins,
} from "../../Utils/Utils";
import { DbContext } from "../../context/DbContext";
import { useEtas } from "../../hooks/Etas";
import { Eta } from "../Search/RouteList/Eta";
import { DirectionContext } from "../../context/DirectionContext";

export const DirectionItem = ({ e, i, handleChange }) => {
  const [stopList, setStopList] = useState([]);
  const { destination, expanded, updateFitBoundMode } =
    useContext(DirectionContext);
  const { gStopList } = useContext(DbContext);
  const { eta, isEtaLoading } = useEtas({
    seq: e.nearbyOrigStopSeq,
    routeObj: e,
    interval: 10000,
  });

  let waitingTime = null;
  let waitingTimeStr = "";
  let arriveTime = "";

  if (eta.length > 0) {
    waitingTime = phaseEtaToWaitingMins(eta[0].eta);
    arriveTime = phaseEtaToTime(eta[0].eta);
    if (waitingTime > 0) {
      waitingTimeStr = `將於 ${waitingTime}分鐘 後抵達 ${
        gStopList[e.nearbyOrigStopId].name.zh
      } (${arriveTime})`;
    } else if (waitingTime === 0) {
      waitingTimeStr = `準備抵達 ${gStopList[e.nearbyOrigStopId].name.zh}`;
    } else {
      waitingTimeStr = `已抵達 ${gStopList[e.nearbyOrigStopId].name.zh}`;
    }
  } else {
    waitingTimeStr = " 沒有班次";
  }

  let estimateTravelTime = null;
  let estimateTravelTimeStr = "";

  if (e.transportTime !== null && eta.length > 0) {
    const waitingTimeArr = eta.map((f) => phaseEtaToWaitingMins(f.eta));

    if (waitingTimeArr[0] > e.origWalkTime) {
      estimateTravelTime = waitingTimeArr[0] + e.transportTime + e.destWalkTime;
    } else if (waitingTimeArr[1] > e.origWalkTime) {
      estimateTravelTime = waitingTimeArr[1] + e.transportTime + e.destWalkTime;
    } else {
      estimateTravelTime = waitingTimeArr[2] + e.transportTime + e.destWalkTime;
    }
    estimateTravelTimeStr = `≈ ${estimateTravelTime}分鐘`;
  }

  const handleStopListBtnOnClick = () => {
    if (stopList.length === 0) {
      const _stopList = [];
      for (let j = e.nearbyOrigStopSeq; j < e.nearbyDestStopSeq - 1; j += 1) {
        _stopList.push(gStopList[e.stops[getCoByRouteObj(e)[0]][j]]);
      }
      setStopList(_stopList);
    } else {
      setStopList([]);
    }
  };

  // if (e.route === "N121") {
  //   console.log(e);
  // }

  return (
    <DirectionItemRoot>
      <Accordion
        expanded={expanded === `panel${i}`}
        onChange={handleChange(`panel${i}`, e)}
      >
        <AccordionSummary>
          <div className="left">
            <div className="simpleStep">
              <div className="walkDistance">
                {e.origWalkDistance <= 400 && <DirectionsWalkIcon />}
                {e.origWalkDistance > 400 && e.origWalkDistance <= 600 && (
                  <DirectionsRunIcon />
                )}
                <div className="time">{e.origWalkTime}</div>
              </div>
              →
              <div className="transportIconWrapper">
                <img
                  className={`transportIcon ${e.route}`}
                  src={companyIconMap[getCoIconByRouteObj(e)]}
                  alt=""
                />
                <div className="route">{e.route} </div>
              </div>
              →
              <div className="walkDistance">
                {e.destWalkDistance <= 400 && <DirectionsWalkIcon />}
                {e.destWalkDistance > 400 && e.destWalkDistance <= 600 && (
                  <DirectionsRunIcon />
                )}
                <div className="time">{e.destWalkTime}</div>
              </div>
            </div>
            <div className="eta">
              {isEtaLoading ? "載入中" : waitingTimeStr}
            </div>
          </div>
          <div className="right">{estimateTravelTimeStr}</div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="detail">
            <button
              type="button"
              className="detailItem"
              onClick={() => updateFitBoundMode("startWalk")}
            >
              <div className="walkNotice">
                {e.origWalkDistance <= 400 && <DirectionsWalkIcon />}
                {e.origWalkDistance > 400 && e.origWalkDistance <= 600 && (
                  <DirectionsRunIcon />
                )}
                <div>
                  步行至 {gStopList[e.nearbyOrigStopId].name.zh} (
                  {e.origWalkDistance}米)
                </div>
              </div>
              <div className="time">{e.origWalkTime}分鐘</div>
            </button>
            <div className="detailItem">
              <div className="waitingNotice">
                <div className="arriveTimeMsgWrapper">
                  <div className="transportIconWrapper">
                    <img
                      className={`transportIcon ${e.route}`}
                      src={companyIconMap[getCoIconByRouteObj(e)]}
                      alt=""
                    />
                  </div>
                  <div className="arriveTimeMsg">
                    <div className="route">{e.route}</div> 到站時間:{" "}
                    {arriveTime}
                  </div>
                </div>
                <div className="eta">
                  <Eta seq={e.nearbyOrigStopSeq} routeObj={e} slice={3} />
                </div>
              </div>
              <div className="time">
                {waitingTime !== null && `${waitingTime}分鐘`}
              </div>
            </div>
            <div className="detailItem">
              <ul className="transportNotice">
                <li>{gStopList[e.nearbyOrigStopId].name.zh}</li>
                {e.nearbyDestStopSeq - e.nearbyOrigStopSeq > 1 && (
                  <button
                    className="stopListBtn"
                    type="button"
                    onClick={handleStopListBtnOnClick}
                  >
                    <div className={`${getCoPriorityId(e)}`}>
                      搭{e.nearbyDestStopSeq - e.nearbyOrigStopSeq}個站
                    </div>
                    {stopList.length === 0 ? (
                      <ExpandMoreIcon />
                    ) : (
                      <ExpandLessIcon />
                    )}
                  </button>
                )}
                <div
                  className="stopList"
                  style={stopList.length === 0 ? { display: "none" } : null}
                >
                  {stopList.map((f, j) => (
                    <li key={j}>{f.name.zh}</li>
                  ))}
                </div>
                <li>{gStopList[e.nearbyDestStopId].name.zh}</li>
              </ul>
              <div className="time">
                {e.transportTime !== null && `${e.transportTime}分鐘`}
              </div>
            </div>
            <button
              type="button"
              className="detailItem"
              onClick={() => updateFitBoundMode("endWalk")}
            >
              <div className="walkNotice">
                {e.destWalkDistance <= 400 && <DirectionsWalkIcon />}
                {e.destWalkDistance > 400 && e.destWalkDistance <= 600 && (
                  <DirectionsRunIcon />
                )}
                <div>
                  步行至 {destination.label} ({e.destWalkDistance}米)
                </div>
              </div>
              <div className="time">{e.destWalkTime}分鐘</div>
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </DirectionItemRoot>
  );
};

const DirectionItemRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  borderBottom: "1px solid lightgrey",
  ".MuiPaper-root": {
    "&:before": {
      backgroundColor: "unset",
    },
    "&.Mui-expanded": {
      backgroundColor: `${primaryColor}17`,
    },
  },
  ".MuiAccordion-root": {
    width: "100%",
    boxShadow: "none",
    padding: "8px 0",
    borderRadius: 0,
    ".MuiAccordionSummary-root": {
      minHeight: 0,
      ".MuiAccordionSummary-content": {
        display: "flex",
        margin: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        ".left": {
          display: "flex",
          flexDirection: "column",
          ".simpleStep": {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            ".transportIconWrapper": {
              display: "flex",
              alignItems: "center",
              ...mtrIconColor,
              ".transportIcon": {
                height: "18px",
              },
            },
            ".route": {
              fontWeight: 900,
            },
            ".walkDistance": {
              display: "flex",
              alignItems: "baseline",
              svg: { fontSize: "18px" },
              ".time": {
                fontSize: "10px",
              },
            },
          },
          ".eta": {
            display: "flex",
            alignItems: "center",
            ...companyColor,
          },
        },
      },
    },
  },
  ".MuiAccordionDetails-root": {
    padding: "8px 16px 8px",
    ".detail": {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
      flexDirection: "column",
      gap: "4px",
      ".detailItem": {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px",
        background: "white",
        borderRadius: "4px",
        alignItems: "center",
        border: "none",
        svg: { fontSize: "14px" },
        ".walkNotice": {
          display: "flex",
        },
        ".transportNotice": {
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          borderLeft: "3px solid",
          paddingLeft: "12px",
          ".stopListBtn": {
            display: "flex",
            alignItems: "center",
            border: "none",
            padding: "0",
            background: "unset",
            fontSize: "12px",
            ...companyColor,
          },
          ".stopList": {
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          },
        },
        ".waitingNotice": {
          ".arriveTimeMsgWrapper": {
            display: "flex",
            alignItems: "center",
            ".transportIconWrapper": {
              display: "flex",
              ...mtrIconColor,
              ".transportIcon": {
                height: "14px",
              },
            },
          },
          ".arriveTimeMsg": {
            display: "flex",
            alignItems: "center",
            ".route": {
              fontWeight: 900,
            },
          },
          ".eta": {
            display: "flex",
            gap: "12px",
          },
        },
      },
    },
  },
});
