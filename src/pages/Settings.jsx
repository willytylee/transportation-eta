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
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  AccountCircle as AccountCircleIcon,
  Update as UpdateIcon,
  Download as DownloadIcon,
  Report as ReportIcon,
  Source as SourceIcon,
  Tune as TuneIcon,
  LayersClear as LayersClearIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { SelectUserDialog } from "../components/Settings/SelectUserDialog";
import { AppContext } from "../context/AppContext";

export const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { appVersion, serVersion } = useContext(AppContext);
  const [slctUsrDialogOpen, setslctUsrDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleClearHistOnClick = () => {
    localStorage.removeItem("routeListHistory");
    enqueueSnackbar("歷史紀錄已清除", {
      variant: "success",
    });
  };

  const handleShareOnClick = () => {
    if (navigator.share) {
      navigator.share({
        title: "交通預報",
        url: "https://eta.willytylee.com",
      });
    }

    navigator.clipboard.writeText("http://eta.willytylee.com");

    enqueueSnackbar("已複製連結, 多謝分享~", {
      variant: "success",
    });
  };

  const handleslctUsrDialogOnClose = ({ userId, username }) => {
    if (userId) {
      localStorage.setItem("user", JSON.stringify({ userId, username }));
    }
    setslctUsrDialogOpen(false);
  };

  const username =
    JSON.parse(localStorage.getItem("user"))?.username || "未載入 (一次性使用)";

  const bookmark = localStorage.getItem("bookmark");
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setslctUsrDialogOpen(true)}
            disabled={!!bookmark}
          >
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="載入用戶書籤"
              secondary={bookmark ? "手機已載入書籤, 此功能不再適用" : username}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings/personal", { replace: true })}
          >
            <ListItemAvatar>
              <Avatar>
                <TuneIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="個人化設定" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              navigate("/settings/bookmarkModify", { replace: true })
            }
          >
            <ListItemAvatar>
              <Avatar>
                <BookmarkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="書籤設定" />
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
          <ListItemButton onClick={handleShareOnClick}>
            <ListItemAvatar>
              <Avatar>
                <ShareIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="分享此應用程式" />
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
        slctUsrDialogOpen={slctUsrDialogOpen}
        handleslctUsrDialogOnClose={handleslctUsrDialogOnClose}
      />
    </>
  );
};
