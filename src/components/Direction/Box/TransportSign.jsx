import { styled } from "@mui/material";
import { companyIconMap } from "../../../constants/Constants";
import { getCoIconByRouteObj } from "../../../Utils/Utils";
import { mtrIconColor, routeMap } from "../../../constants/Mtr";

export const TransportSign = ({ routeObj }) => (
    <TransportSignRoot>
      <img
        className={`transportIcon ${routeObj.route}`}
        src={companyIconMap[getCoIconByRouteObj(routeObj)]}
        alt=""
      />
      {routeObj.co[0] === "mtr" ? (
        <div className={routeObj.route}>{routeMap[routeObj.route]}</div>
      ) : (
        <div className="route">{routeObj.route} </div>
      )}
    </TransportSignRoot>
  );

const TransportSignRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  ...mtrIconColor,
  ".transportIcon": {
    height: "18px",
  },
});
