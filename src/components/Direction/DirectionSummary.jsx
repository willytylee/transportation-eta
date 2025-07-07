import { useContext } from "react";
import { styled, AccordionSummary } from "@mui/material";
import { phaseEtaToWaitingMins } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { DbContext } from "../../context/DbContext";
import { WalkSign } from "./Box/WalkSign";
import { TransportSign } from "./Box/TransportSign";

export const DirectionSummary = ({
  eta,
  routeObj: { origRouteObj, destRouteObj },
  origStopId,
  origWalkDistance,
  destWalkDistance,
  origWalkTime,
  destWalkTime,
  transportTime: { origTransportTime, destTransportTime },
  isEtaLoading,
  waitingTime,
  arriveTime,
  isMultiRoute,
}) => {
  const { gStopList } = useContext(DbContext);

  let estimateTravelTime = null;
  let estimateTravelTimeStr = "";

  function formatTime(minutes) {
    if (typeof minutes !== "number" || minutes < 0) {
      return minutes;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `≈ ${remainingMinutes}分鐘`;
    } else if (remainingMinutes === 0) {
      return `≈ ${hours}小時`;
    }
    return `≈ ${hours}小時${remainingMinutes}分鐘`;
  }

  let waitingTimeStr;

  if (eta.length > 0) {
    if (waitingTime > 0) {
      waitingTimeStr = `將於 ${waitingTime}分鐘 後抵達 ${gStopList[origStopId].name.zh} (${arriveTime})`;
    } else if (waitingTime === 0) {
      waitingTimeStr = `準備抵達 ${gStopList[origStopId].name.zh}`;
    } else {
      waitingTimeStr = `已抵達 ${gStopList[origStopId].name.zh}`;
    }
  } else {
    waitingTimeStr = " 沒有班次";
  }
  if (origTransportTime !== null && destTransportTime !== null) {
    const etaTimes = eta.map((f) => phaseEtaToWaitingMins(f.eta));

    if (etaTimes[0] > origWalkTime) {
      estimateTravelTime =
        etaTimes[0] + origTransportTime + destTransportTime + destWalkTime;
      estimateTravelTimeStr = formatTime(estimateTravelTime);
    } else if (etaTimes[1] > origWalkTime) {
      estimateTravelTime =
        etaTimes[1] + origTransportTime + destTransportTime + destWalkTime;
      estimateTravelTimeStr = formatTime(estimateTravelTime);
    } else if (etaTimes[2] > origWalkTime) {
      estimateTravelTime =
        etaTimes[2] + origTransportTime + destTransportTime + destWalkTime;
      estimateTravelTimeStr = formatTime(estimateTravelTime);
    } else {
      const timeWithoutWaiting =
        origWalkTime + origTransportTime + destTransportTime + destWalkTime;
      if (eta.length > 0) {
        estimateTravelTimeStr = `${formatTime(timeWithoutWaiting)}`;
      } else {
        estimateTravelTimeStr = `${formatTime(timeWithoutWaiting)} (沒有班次)`;
      }
    }
  } else {
    estimateTravelTimeStr = "未能計算時間";
  }

  return (
    <DirectionSummaryRoot>
      <div className="left">
        <div className="simpleStep">
          <WalkSign walkDistance={origWalkDistance} walkTime={origWalkTime} />→
          <TransportSign routeObj={origRouteObj} />
          {isMultiRoute && (
            <>
              → <TransportSign routeObj={destRouteObj} />
            </>
          )}
          →
          <WalkSign walkDistance={destWalkDistance} walkTime={destWalkTime} />
        </div>
        <div className="eta">{isEtaLoading ? "載入中" : waitingTimeStr}</div>
      </div>
      <div className="right">{estimateTravelTimeStr}</div>
    </DirectionSummaryRoot>
  );
};

const DirectionSummaryRoot = styled(AccordionSummary)({
  ".left": {
    display: "flex",
    flexDirection: "column",
    ".simpleStep": {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      ".transportIconWrapper": {},
      ".route": {
        fontWeight: 900,
      },
    },
    ".eta": {
      display: "flex",
      alignItems: "center",
      ...companyColor,
    },
  },
});
