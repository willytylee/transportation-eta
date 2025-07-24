import { useParams } from "react-router-dom";
import { styled } from "@mui/material";
import { Eta } from "./RouteList/Eta";

export const StopEta = ({
  seq,
  stopObj,
  routeObj,
  slice,
  childStyles,
  stopListRenderKey,
}) => {
  const { stopId } = useParams();

  return (
    <StopEtaRoot childStyles={childStyles}>
      <div className="seq">{seq}.</div>
      <div className="col2Wrapper">
        <div className="stop">{stopObj.name.zh}</div>
        {stopId && stopId === stopObj.stopId && routeObj.fares && (
          <div className="fare">${routeObj.fares[seq - 1]}</div>
        )}
      </div>
      <div className="etas">
        <Eta
          seq={seq}
          routeObj={routeObj}
          slice={slice}
          key={stopListRenderKey}
        />
      </div>
    </StopEtaRoot>
  );
};

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
  ".col2Wrapper": {
    flex: 1,
  },
  ".etas": {
    width: "160px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    ".eta": {
      width: "33.33%",
      ".extra": {
        fontSize: "11px",
      },
    },
  },
  ...childStyles,
}));
