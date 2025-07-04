import { styled } from "@mui/material";
import { companyIconMap } from "../../../constants/Constants";
import {
  getCoIconByRouteObj,
  phaseEtaToWaitingMins,
} from "../../../Utils/Utils";
import { routeMap } from "../../../constants/Mtr";
import { mtrIconColor } from "../../../constants/Mtr";
import { Eta } from "../../Search/RouteList/Eta";

export const TransportEta = ({
  eta,
  routeObj,
  stopSeq,
  walkTime,
  arriveTime,
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

  return (
    <TransportEtaRoot className="detailItem">
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
          <Eta seq={stopSeq} routeObj={routeObj} slice={3} />
        </div>
      </div>
      <div className="time">{`${timeForNextRoute}分鐘`}</div>
    </TransportEtaRoot>
  );
};

const TransportEtaRoot = styled("div")({
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
      ...mtrIconColor,
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
