import { useState, useContext } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
} from "@mui/material/";
import { useNavigate } from "react-router-dom";
import {
  AccountCircle as AccountCircleIcon,
  // Lightbulb as LightbulbIcon,
  Update as UpdateIcon,
  Download as DownloadIcon,
  Report as ReportIcon,
  Source as SourceIcon,
} from "@mui/icons-material";
import { SelectUserDialog } from "../components/SelectUserDialog";
import { AppContext } from "../context/AppContext";

export const Settings = () => {
  const { appVersion, serVersion, updateCurrentUserId } =
    useContext(AppContext);
  const [slctUsrDialogOpen, setslctUsrDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleslctUsrDialogOnClose = ({ userId, username }) => {
    if (userId) {
      localStorage.setItem("user", JSON.stringify({ userId, username }));
      updateCurrentUserId(userId);
    }
    setslctUsrDialogOpen(false);
  };

  let username;
  try {
    username = JSON.parse(localStorage.getItem("user")).username;
  } catch (e) {
    username = "未設定";
  }

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setslctUsrDialogOpen(true)}>
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="選擇用戶" secondary={username} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings/update", { replace: true })}
          >
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
            <ListItemText primary="更新" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding className="listItemAppIcon">
          <ListItemButton
            onClick={() => navigate("/settings/install", { replace: true })}
          >
            <ListItemAvatar>
              <Avatar>
                <DownloadIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="安裝到手機" />
          </ListItemButton>
        </ListItem>
        {/* <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings/tutorial", { replace: true })}
          >
            <ListItemAvatar>
              <Avatar>
                <LightbulbIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="教學" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://wa.me/+85267914731"
            target="_blank"
          >
            <ListItemAvatar>
              <Avatar>
                <ReportIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="回報問題" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings/about", { replace: true })}
          >
            <ListItemAvatar>
              <Avatar>
                <SourceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="關於" />
          </ListItemButton>
        </ListItem>
      </List>
      <SelectUserDialog
        fullWidth
        slctUsrDialogOpen={slctUsrDialogOpen}
        handleslctUsrDialogOnClose={handleslctUsrDialogOnClose}
      />
    </>
  );
};
