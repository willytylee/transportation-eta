import { styled } from "@mui/material";
import { companyIconMap } from "../../../constants/Constants";
import { getCoIconByRouteObj } from "../../../Utils/Utils";
import { mtrIconColor, mtrLineColor, routeMap } from "../../../constants/Mtr";

export const TransportSign = ({ routeObj }) => (
  <TransportSignRoot>
    <img
      className={`transportIcon ${routeObj.route}`}
      src={companyIconMap[getCoIconByRouteObj(routeObj)]}
      alt=""
    />
    {routeObj.co[0] === "mtr" ? (
      <div className={`route ${routeObj.route}`}>
        {routeMap[routeObj.route]}
      </div>
    ) : (
      <div className="route">{routeObj.route} </div>
    )}
  </TransportSignRoot>
);

const TransportSignRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "2px",
  ".transportIcon": {
    height: "18px",
    ...mtrIconColor,
  },
  ".route": {
    ...mtrLineColor,
  },
});
