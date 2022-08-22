import { useContext } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
} from "@mui/material/";
import {
  Update as UpdateIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";

export const Update = () => {
  const { initDb, appVersion, serVersion } = useContext(AppContext);

  const handleRouteDBOnClick = () => {
    localStorage.removeItem("dbVersion");
    initDb();
    window.location.reload();
  };

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={() => window.location.reload()}>
          <ListItemAvatar>
            <Badge
              color="primary"
              badgeContent=" "
              overlap="circular"
              invisible={appVersion === serVersion}
              sx={{
                ".MuiBadge-badge": {
                  minWidth: "14px",
                  height: "14px",
                },
              }}
            >
              <Avatar>
                <UpdateIcon />
              </Avatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary="更新應用程式"
            secondary={
              <span>
                {appVersion === serVersion ? (
                  <span>目前為最新版本: {appVersion}</span>
                ) : (
                  <span>
                    目前版本: {appVersion} <br />
                    最新版本: {serVersion}
                  </span>
                )}
              </span>
            }
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={handleRouteDBOnClick}>
          <ListItemAvatar>
            <Avatar>
              <StorageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="重新建立路線資料庫"
            secondary="如發現路線未更新, 請按此重新建立路線資料庫"
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
