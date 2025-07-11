import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";
import { phaseEta } from "../../../Utils/Utils";
import { mtrLineColor } from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";
import { TransportSign } from "../../Direction/Box/TransportSign";

export const StopGroupListSectionItem = ({ eta, setNearbyDialogOpen }) => {
  const { gRouteList } = useContext(DbContext);

  const navigate = useNavigate();
  const routeObj = gRouteList[eta.routeKey];

  const handleRouteItemOnClick = (routeKey, stopId) => {
    navigate("/search/" + routeKey + "/" + stopId, { replace: true });
    if (setNearbyDialogOpen) {
      setNearbyDialogOpen(false);
    }
  };

  return (
    <StopGrouListSectionItemRoot
      onClick={() => handleRouteItemOnClick(eta.routeKey, eta.stopId)}
      eta={eta}
    >
      <TransportSign routeObj={routeObj} />
      <div className="nearStopDest">
        <div>
          <span className="dest">{routeObj.dest.zh}</span>
          <span className="special">
            {" "}
            {parseInt(routeObj.serviceType, 10) !== 1 && "特別班次"}
          </span>
        </div>
      </div>
      <div className="etas">
        {eta.etas.length > 0
          ? phaseEta({
              etaStr: eta.etas[0].eta,
              remark: eta.etas[0].rmk_tc,
            }).etaIntervalStr
          : "沒有班次"}
      </div>
    </StopGrouListSectionItemRoot>
  );
};

const StopGrouListSectionItemRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "eta",
})(({ eta }) => ({
  display: "flex",
  alignItems: "center",
  padding: "4px 0",
  borderBottom: "1px solid lightgrey",
  color: eta.etas.length === 0 && "#c5c5c5",
  ".route": {
    fontWeight: "900",
    width: "55px",
    ...mtrLineColor,
  },
  ".nearStopDest": {
    width: "57.5%",
    ".special": {
      fontSize: "10px",
    },
  },
  ".etas": {
    width: "20%",
    float: "left",
  },
}));
