import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
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

export const Settings = () => {
  const [slctUsrDialogOpen, setslctUsrDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleslctUsrDialogOnClose = ({ userId, username }) => {
    if (userId) {
      localStorage.setItem(
        "user",
        JSON.stringify({ userId: userId, username: username })
      );
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
          <ListItemButton onClick={() => window.location.reload()}>
            <ListItemAvatar>
              <Avatar>
                <UpdateIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="更新應用程式" />
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
            component={"a"}
            href={`https://wa.me/+85267914731`}
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
