import { useContext } from "react";
import { styled } from "@mui/material/";
import { ListItemText } from "@mui/material/";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";

export const RouteListItemText = ({ i, e }) => {
  const { gStopList } = useContext(DbContext);

  return (
    <ListItemTextRoot
      primary={
        e.co === "mtr" ? (
          <span className={e.co}>{e.route}</span>
        ) : (
          <span className={e.co}>{e.route}</span>
        )
      }
      secondary={gStopList[e.stopId].name.zh}
    />
  );
};

const ListItemTextRoot = styled(ListItemText)({
  ".MuiListItemText-primary": {
    width: "70px",
    ...companyColor,
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
});
