import React from "react";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material/";

export const Settings = () => {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => window.location.reload()}>
            <ListItemText primary="更新應用程式" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};
