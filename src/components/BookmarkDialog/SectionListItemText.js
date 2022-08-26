import { useContext } from "react";
import { styled } from "@mui/material/";
import { ListItemText } from "@mui/material/";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";

export const SectionListItemText = ({ i, e }) => {
  const { gStopList } = useContext(DbContext);

  return (
    <ListItemTextRoot
      primary={`組合${i + 1}`}
      secondary={
        e.length > 0 ? (
          e.map((f, j) => (
            <span className="routeStopName" key={j}>
              <span className={`route ${f.co}`}>{f.route}</span>
              <span className="stopName">{gStopList[f.stopId].name.zh}</span>
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
    },
  },
});
