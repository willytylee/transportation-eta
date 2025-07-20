import { styled } from "@mui/material";
import { companyIconMap } from "../../../constants/Constants";
import { getCoIconByRouteObj } from "../../../utils/Utils";
import { mtrIconColor, mtrLineColor, routeMap } from "../../../constants/Mtr";

export const TransportSign = ({ routeObj }) => {
  const { route, co } = routeObj;
  const isMtr = co[0] === "mtr";
  const isLrt = co[0] === "lightRail";
  return (
    <TransportSignRoot>
      <img
        className={`transportIcon ${isLrt ? "L" + route : route}`}
        src={companyIconMap[getCoIconByRouteObj(routeObj)]}
        alt=""
      />
      {isMtr ? (
        <div className={`route ${route}`}>{routeMap[route]}</div>
      ) : (
        <div className="route">{route} </div>
      )}
    </TransportSignRoot>
  );
};

const TransportSignRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "2px",
  ".transportIcon": {
    height: "18px",
    ...mtrIconColor,
  },
  ".route": {
    fontWeight: 900,
    ...mtrLineColor,
  },
});
