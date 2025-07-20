import { styled, Button } from "@mui/material";
import { phaseEta } from "../../../utils/Utils";
import { mtrLineColor } from "../../../constants/Mtr";
import { TransportSign } from "./TransportSign";

export const TransportEta = ({
  eta,
  routeObj,
  walkTime,
  arriveTime,
  updateFitBoundMode,
  fitBoundMode,
}) => {
  let timeForNextRoute = 0;

  if (eta.length > 0) {
    const etaTimes = eta.map((f) => phaseEta({ etaStr: f.eta }).waitingMins);

    if (walkTime) {
      if (etaTimes[0] > walkTime) {
        timeForNextRoute = etaTimes[0];
      } else if (etaTimes[1] > walkTime) {
        timeForNextRoute = etaTimes[1];
      } else if (etaTimes[2] > walkTime) {
        timeForNextRoute = etaTimes[2];
      }
    } else {
      timeForNextRoute = etaTimes[0];
    }
  }

  const handleOnClick = () => {
    updateFitBoundMode(fitBoundMode);
  };

  return (
    <TransportEtaRoot className="detailItem" onClick={handleOnClick}>
      <div className="waitingNotice">
        <div className="arriveTimeMsgWrapper">
          <TransportSign routeObj={routeObj} />
          <div className="arriveTimeMsg"> 到站時間: {arriveTime}</div>
        </div>
        <div className="etas">
          {eta.length > 0 &&
            eta.map((e, i) => (
              <div key={i} className="eta">
                {phaseEta({ etaStr: e.eta, remark: e.rmk_tc }).etaIntervalStr}
              </div>
            ))}
        </div>
      </div>
      {fitBoundMode === "transportEtaA" && (
        <div className="time">{`${timeForNextRoute}分鐘`}</div>
      )}
    </TransportEtaRoot>
  );
};

const TransportEtaRoot = styled(Button)({
  color: "rgba(0, 0, 0, 0.87)",
  ".waitingNotice": {
    ".arriveTimeMsgWrapper": {
      display: "flex",
      alignItems: "center",
      gap: "2px",
      ".transportIcon": {
        height: "14px",
      },
    },
    ".arriveTimeMsg": {
      display: "flex",
      alignItems: "center",
      ".route": {
        fontWeight: 900,
        ...mtrLineColor,
      },
    },
    ".etas": {
      display: "flex",
      gap: "12px",
    },
  },
});
