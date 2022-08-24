import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material/";
import { PhoneIphone as PhoneIphoneIcon } from "@mui/icons-material";

import { DefaultScrnDialog } from "../../components/Settings/DefaultScrnDialog";

export const Personal = () => {
  const [defaultScrnDialogOpen, setDefaultScrnDialogOpen] = useState(false);

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
            <ListItemText primary="預設載入版面" secondary={defaultScreen} />
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
