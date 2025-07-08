import { styled, Button } from "@mui/material";
import { companyIconMap } from "../../../constants/Constants";
import {
  getCoIconByRouteObj,
  phaseEtaToWaitingMins,
  etaTimeConverter,
} from "../../../Utils/Utils";
import { routeMap } from "../../../constants/Mtr";
import { mtrLineColor } from "../../../constants/Mtr";

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
    const etaTimes = eta.map((f) => phaseEtaToWaitingMins(f.eta));

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
          <div className="transportIconWrapper">
            <img
              className={`transportIcon ${routeObj.route}`}
              src={companyIconMap[getCoIconByRouteObj(routeObj)]}
              alt=""
            />
          </div>
          <div className="arriveTimeMsg">
            {routeObj.co[0] === "mtr" ? (
              <div className={routeObj.route}>{routeMap[routeObj.route]}</div>
            ) : (
              <div className="route">{routeObj.route} </div>
            )}
            到站時間: {arriveTime}
          </div>
        </div>
        <div className="eta">
          {eta.length > 0 &&
            eta.map((e, i) => (
              <div key={i} className="eta">
                {
                  etaTimeConverter({ etaStr: e.eta, remark: e.rmk_tc })
                    .etaIntervalStr
                }
              </div>
            ))}
        </div>
      </div>
      <div className="time">{`${timeForNextRoute}分鐘`}</div>
    </TransportEtaRoot>
  );
};

const TransportEtaRoot = styled(Button)({
  color: "rgba(0, 0, 0, 0.87)",
  ".waitingNotice": {
    ".arriveTimeMsgWrapper": {
      display: "flex",
      alignItems: "center",
      ".transportIconWrapper": {
        display: "flex",
        ".transportIcon": {
          height: "14px",
          ...mtrLineColor,
        },
      },
    },
    ".arriveTimeMsg": {
      display: "flex",
      alignItems: "center",
      ...mtrLineColor,
      ".route": {
        fontWeight: 900,
      },
    },
    ".eta": {
      display: "flex",
      gap: "12px",
    },
  },
});
