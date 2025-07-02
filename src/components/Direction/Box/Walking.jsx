import { useContext } from "react";
import { styled } from "@mui/material";
import {
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";
import { DbContext } from "../../../context/DbContext";

export const Walking = ({
  walkDistance,
  stopId,
  walkTime,
  updateFitBoundMode,
  fitBoundMode,
}) => {
  const { gStopList } = useContext(DbContext);

  return (
    <WalkingRoot
      type="button"
      className="detailItem"
      onClick={() => updateFitBoundMode(fitBoundMode)}
    >
      <div className="walkNotice">
        {walkDistance <= 400 && <DirectionsWalkIcon />}
        {walkDistance > 400 && <DirectionsRunIcon />}
        <div>
          步行至 {gStopList[stopId].name.zh} ({walkDistance}
          米)
        </div>
      </div>
      <div className="time">{walkTime}分鐘</div>
    </WalkingRoot>
  );
};

const WalkingRoot = styled("button")({
  ".walkNotice": {
    display: "flex",
    alignItems: "center",
  },
});
