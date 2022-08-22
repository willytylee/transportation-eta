import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material/";
import { LayersClear as LayersClearIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";

export const Personal = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClearHistOnClick = () => {
    localStorage.removeItem("routeListHistory");
    enqueueSnackbar("歷史紀錄已清除", {
      variant: "success",
    });
  };

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={handleClearHistOnClick}>
          <ListItemAvatar>
            <Avatar>
              <LayersClearIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="清除路線歷史紀錄" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
