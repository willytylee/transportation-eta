import { styled } from "@mui/material";
import {
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";

export const WalkSign = ({ walkDistance, walkTime }) => (
    <WalkSignRoot>
      {walkDistance <= 400 && <DirectionsWalkIcon />}
      {walkDistance > 400 && <DirectionsRunIcon />}
      <div className="time">{walkTime}</div>
    </WalkSignRoot>
  );

const WalkSignRoot = styled("div")({
  display: "flex",
  alignItems: "baseline",
  svg: { fontSize: "18px" },
  ".time": {
    fontSize: "10px",
  },
});
