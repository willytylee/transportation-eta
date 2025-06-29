import { useContext } from "react";
import { styled } from "@mui/material/";
import { ListItemText } from "@mui/material/";
import { PriorityHigh as PriorityHighIcon } from "@mui/icons-material";
import { companyColor } from "../../constants/Constants";
import { mtrLineColor, stationMap } from "../../constants/Mtr";
import { DbContext } from "../../context/DbContext";
import { getFirstCoByRouteObj } from "../../Utils/Utils";

export const CategoryListItemText = ({ e }) => {
  const { gRouteList, gStopList } = useContext(DbContext);
  return (
    <ListItemTextRoot
      primary={e.title}
      secondary={
        e.data.length > 0 ? (
          e.data.map((f, j) => {
            // Handle old bookmark format
            // New bookmark format only have routeKey, seq & stopId
            const { routeKey } = f;
            const routeData = gRouteList[routeKey];
            const co = routeKey ? getFirstCoByRouteObj(routeData) : f.co;
            const route = routeKey ? routeData.route : f.route;

            return (
              <span key={j} className="routeStopWrapper">
                <span className="route">
                  {co === "mtr" ? (
                    <span className={route}>{stationMap[f.stopId]}</span>
                  ) : routeKey ? (
                    <span className={co}>{route}</span>
                  ) : (
                    <span className="error">
                      {route} <PriorityHighIcon fontSize="small" />
                    </span>
                  )}
                </span>
                <span className="stop">{gStopList[f.stopId].name.zh}</span>
              </span>
            );
          })
        ) : (
          <>未有路線</>
        )
      }
    />
  );
};

const ListItemTextRoot = styled(ListItemText)({
  ".MuiListItemText-primary": {
    fontSize: "14px",
    paddingRight: "6px",
  },
  ".MuiListItemText-secondary": {
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    listStyleType: "disc",
    paddingLeft: "6px",
    ...companyColor,
    ...mtrLineColor,
    ".routeStopWrapper": {
      display: "flex",
      ".route": {
        width: "40px",
      },
    },
  },
  ".error": {
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
  },
});
