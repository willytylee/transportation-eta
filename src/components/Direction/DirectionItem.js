import { useContext } from "react";
import { styled } from "@mui/material";
import {
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";
import { companyColor, companyMap } from "../../constants/Constants";
import { routeMap } from "../../constants/Mtr";
import { getCoByStopObj } from "../../Utils/Utils";
import { DbContext } from "../../context/DbContext";
import { useEtas } from "../../hooks/Etas";

export const DirectionItem = ({ e }) => {
  const { gStopList } = useContext(DbContext);

  const { eta, isEtaLoading } = useEtas({
    seq: e.nearbyOrigStopSeq,
    routeObj: e,
  });

  let time = "";

  if (eta.length > 0) {
    time = eta[0].eta;
  }

  return (
    <DirectionItemRoot>
      <div className="firstRow">
        <div className="left">
          <div className="walkDistance">
            {e.origWalkDistance <= 400 && <DirectionsWalkIcon />}
            {e.origWalkDistance > 400 && e.origWalkDistance <= 600 && (
              <DirectionsRunIcon />
            )}
            <div className="time">{e.origWalkTime}</div>
          </div>
          →
          <div className="company">
            {getCoByStopObj(e)
              .map((companyId, j) => (
                <span key={j} className={companyId}>
                  {companyId !== "mtr" && companyMap[companyId]}
                  {companyId === "mtr" && (
                    <span className={`${e.route}`}> {routeMap[e.route]}</span>
                  )}
                </span>
              ))
              .reduce((a, b) => [a, " + ", b])}
          </div>
          <div className="route">{e.route} </div> →
          <div className="walkDistance">
            {e.destWalkDistance <= 400 && <DirectionsWalkIcon />}
            {e.destWalkDistance > 400 && e.destWalkDistance <= 600 && (
              <DirectionsRunIcon />
            )}
            <div className="time">{e.destWalkTime}</div>
          </div>
        </div>
        <div className="right">
          {e.transportTime !== 0 &&
            `≈
                  ${e.origWalkTime + e.transportTime + e.destWalkTime}分鐘`}
        </div>
      </div>
      <div className="eta">
        {isEtaLoading
          ? "載入中"
          : `${time}分鐘 後到達 ${gStopList[e.nearbyOrigStopId].name.zh}`}
      </div>
      <div className="detail">
        <div className="walkDistance">
          {e.origWalkDistance <= 400 && <DirectionsWalkIcon />}
          {e.origWalkDistance > 400 && e.origWalkDistance <= 600 && (
            <DirectionsRunIcon />
          )}
          <div className="time">{e.origWalkTime}</div>
        </div>
        → <div>{gStopList[e.nearbyOrigStopId].name.zh}</div> →
        <div>{e.nearbyDestStopSeq - e.nearbyOrigStopSeq}個站</div> →{" "}
        <div>{gStopList[e.nearbyDestStopId].name.zh}</div> →
        <div className="walkDistance">
          {e.destWalkDistance <= 400 && <DirectionsWalkIcon />}
          {e.destWalkDistance > 400 && e.destWalkDistance <= 600 && (
            <DirectionsRunIcon />
          )}
          <div className="time">{e.destWalkTime}</div>
        </div>
      </div>
    </DirectionItemRoot>
  );
};

const DirectionItemRoot = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "8px 10px",
  borderBottom: "1px solid lightgrey",
  gap: "4px",
  ".firstRow": {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    ".left": {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      ".company": {
        ...companyColor,
      },
      ".route": {
        fontWeight: 900,
      },
      ".walkDistance": {
        display: "flex",
        alignItems: "baseline",
        svg: { fontSize: "14px" },
        ".time": {
          fontSize: "10px",
        },
      },
    },
    ".right": {
      display: "flex",
      gap: "12px",
    },
  },
  ".eta": {
    display: "flex",
  },
  ".detail": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: "4px",
    ".walkDistance": {
      display: "flex",
      alignItems: "baseline",
      svg: { fontSize: "14px" },
      ".time": {
        fontSize: "10px",
      },
    },
  },
});
