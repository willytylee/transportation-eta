import { styled } from "@mui/material";
import { Eta } from "./RouteList/Eta";

export const StopEta = ({
  seq,
  stopObj: { name, stopId },
  routeObj,
  slice,
  childStyles,
}) => (
  <StopEtaRoot childStyles={childStyles}>
    <div className="seq">{seq}.</div>
    <div className="stop" title={stopId}>
      {name.zh}
    </div>
    <div className="etas">
      <Eta seq={seq} routeObj={routeObj} slice={slice} />
    </div>
  </StopEtaRoot>
);

const StopEtaRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "childStyles",
})(({ childStyles }) => ({
  display: "flex",
  padding: "4px 0",
  width: "100%",
  alignItems: "baseline",
  ".seq": {
    width: "20px",
    flexShrink: 0,
  },
  ".stop": {
    flex: 1,
  },
  ".etas": {
    width: "180px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    ".eta": {
      width: "33.33%",
      ".extra": {
        fontSize: "11px",
      },
    },
  },
  ...childStyles,
}));
