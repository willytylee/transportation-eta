import { useContext } from "react";
import { styled, Button } from "@mui/material";
import {
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";
import { DbContext } from "../../../context/DbContext";
import { DirectionContext } from "../../../context/DirectionContext";

export const Walking = ({
  walkDistance,
  stopId,
  walkTime,
  updateFitBoundMode,
  fitBoundMode,
}) => {
  const { gStopList } = useContext(DbContext);
  const { destination } = useContext(DirectionContext);

  const handleOnClick = () => {
    updateFitBoundMode(fitBoundMode);
  };

  return (
    <WalkingRoot className="detailItem" onClick={handleOnClick}>
      <div className="walkNotice">
        {walkDistance <= 400 && <DirectionsWalkIcon />}
        {walkDistance > 400 && <DirectionsRunIcon />}
        <div>
          步行至 {stopId ? gStopList[stopId].name.zh : destination.value} (
          {walkDistance}
          米)
        </div>
      </div>
      <div className="time">{walkTime}分鐘</div>
    </WalkingRoot>
  );
};

const WalkingRoot = styled(Button)({
  color: "#2f305c",
  ".walkNotice": {
    display: "flex",
    alignItems: "center",
  },
});
