import { useContext } from "react";
import { styled } from "@mui/material/";
import { ListItemText } from "@mui/material/";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";
import { mtrLineColor, routeMap, stationMap } from "../../constants/Mtr";

export const SectionListItemText = ({ i, e }) => {
  const { gStopList } = useContext(DbContext);

  return (
    <ListItemTextRoot
      primary={`組合${i + 1}`}
      secondary={
        e.length > 0 ? (
          e.map((route, j) => (
            <span className="routeStopName" key={j}>
              {route.co === "mtr" ? (
                <>
                  <span className={`route ${route.route}`}>
                    {routeMap[route.route]}
                  </span>
                  <span className={`stopName ${route.route}`}>
                    {stationMap[route.stopId]}
                  </span>
                </>
              ) : (
                <>
                  <span className={`route ${route.co}`}>{route.route}</span>
                  <span className="stopName">
                    {gStopList[route.stopId].name.zh}
                  </span>
                </>
              )}
            </span>
          ))
        ) : (
          <>未有路線</>
        )
      }
    />
  );
};

const ListItemTextRoot = styled(ListItemText)({
  ".MuiListItemText-secondary": {
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    ".routeStopName": {
      display: "flex",
      ".route": {
        display: "inline-block",
        width: "50px",
      },
      ".stopName": {
        display: "flex",
        flex: 1,
      },
      ...companyColor,
      ...mtrLineColor,
    },
  },
});
