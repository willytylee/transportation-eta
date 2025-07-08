import { useContext } from "react";
import { styled, ListItemText } from "@mui/material/";
import { PriorityHigh as PriorityHighIcon } from "@mui/icons-material";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";
import { mtrLineColor, routeMap } from "../../constants/Mtr";
import { getFirstCoByRouteObj } from "../../Utils/Utils";

export const RouteListItemText = ({ e }) => {
  const { gRouteList, gStopList } = useContext(DbContext);
  const { routeKey } = e;
  const routeData = gRouteList[routeKey];
  const co = routeKey ? getFirstCoByRouteObj(routeData) : e.co;
  const route = routeKey ? routeData.route : e.route;

  return (
    <ListItemTextRoot
      primary={
        co === "mtr" ? (
          <span className={`route ${route}`}>{routeMap[route]}</span>
        ) : (
          <span className={routeKey ? co : "error"}>{route}</span>
        )
      }
      secondary={
        co === "mtr" ? (
          <span className={route}>{gStopList[e.stopId].name.zh}</span>
        ) : routeKey ? (
          <span className={co}>{gStopList[e.stopId].name.zh}</span>
        ) : (
          <span className="error">
            {gStopList[e.stopId].name.zh} <PriorityHighIcon fontSize="small" />
          </span>
        )
      }
    />
  );
};

const ListItemTextRoot = styled(ListItemText)({
  display: "flex",
  alignItems: "center",
  ".MuiListItemText-primary": {
    ...companyColor,
    width: "60px",
    fontSize: "14px",
    ".route": {
      ...mtrLineColor,
    },
  },
  ".MuiListItemText-secondary": {
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    ".route": {
      display: "inline-block",
      width: "50px",
    },
  },
  ".error": {
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
  },
});
