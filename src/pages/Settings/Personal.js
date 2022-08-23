import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material/";
import {
  LayersClear as LayersClearIcon,
  PhoneIphone as PhoneIphoneIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { DefaultScrnDialog } from "../../components/Settings/DefaultScrnDialog";

export const Personal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [defaultScrnDialogOpen, setDefaultScrnDialogOpen] = useState(false);

  const handleClearHistOnClick = () => {
    localStorage.removeItem("routeListHistory");
    enqueueSnackbar("歷史紀錄已清除", {
      variant: "success",
    });
  };

  const defaultScreen =
    JSON.parse(localStorage.getItem("settings"))?.defaultScreen || "路線搜尋";

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setDefaultScrnDialogOpen(true)}>
            <ListItemAvatar>
              <Avatar>
                <PhoneIphoneIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="預設版面" secondary={defaultScreen} />
          </ListItemButton>
        </ListItem>
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
      <DefaultScrnDialog
        fullWidth
        defaultScrnDialogOpen={defaultScrnDialogOpen}
        setDefaultScrnDialogOpen={setDefaultScrnDialogOpen}
      />
    </>
  );
};
