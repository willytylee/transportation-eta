import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material/";
import { Update as UpdateIcon } from "@mui/icons-material/";

export const Settings = () => {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => window.location.reload()}>
            <ListItemIcon>
              <UpdateIcon />
            </ListItemIcon>
            <ListItemText primary="更新應用程式" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};
