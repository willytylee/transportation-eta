import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  styled,
} from "@mui/material/";
import { Directions as DirectionsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Lab = () => {
  const navigate = useNavigate();
  return (
    <ListRoot>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate("/direction", { replace: true })}
        >
          <ListItemAvatar>
            <Avatar>
              <DirectionsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="規劃行程" />
        </ListItemButton>
      </ListItem>
    </ListRoot>
  );
};

const ListRoot = styled(List)({
  ".MuiListSubheader-root": {
    lineHeight: "18px",
    paddingTop: "20px",
  },
  ".listItemAppIcon": {
    ".MuiAvatar-root": {
      background: "#ffef41",
      img: {
        width: "70%",
      },
    },
  },
});
