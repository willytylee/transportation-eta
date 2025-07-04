import { useContext } from "react";
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Divider, Badge } from "@mui/material/";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Announcement as AnnouncementIcon } from "@mui/icons-material";
import { AppContext } from "../context/AppContext";

export const More = () => {
  const { appVersion, serVersion } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/news", { replace: true })}>
            <ListItemAvatar>
              <Avatar>
                <AnnouncementIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="交通消息" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/settings", { replace: true })}>
            <ListItemAvatar>
              <Avatar>
                <Badge color="primary" variant="dot" overlap="circular" invisible={appVersion === serVersion}>
                  <SettingsIcon />
                </Badge>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="設定" />
          </ListItemButton>
        </ListItem>
    </List>
  );
};
