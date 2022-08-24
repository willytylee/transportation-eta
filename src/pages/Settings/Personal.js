import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListSubheader,
} from "@mui/material/";
import {
  DirectionsBus as DirectionsBusIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
  Announcement as AnnouncementIcon,
  AccessTime as AccessTimeIcon,
  DepartureBoard as DepartureBoardIcon,
  TableView as TableViewIcon,
  Filter1 as Filter1Icon,
  Filter2 as Filter2Icon,
  Filter3 as Filter3Icon,
  Filter4 as Filter4Icon,
  Filter5 as Filter5Icon,
  Filter6 as Filter6Icon,
  Filter7 as Filter7Icon,
  Filter8 as Filter8Icon,
  Filter9 as Filter9Icon,
} from "@mui/icons-material";
import { SimpleSettingDialog } from "../../components/Settings/SimpleSettingDialog";

export const Personal = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogOptions, setDialogOptions] = useState([]);
  const [dialogKey, setDialogKey] = useState("");

  const defaultScreen =
    JSON.parse(localStorage.getItem("settings"))?.defaultScreen || "路線搜尋";
  const bookmarkDisplay =
    JSON.parse(localStorage.getItem("settings"))?.bookmarkDisplay ||
    "所有路線班次排序";
  const etaRouteNum =
    JSON.parse(localStorage.getItem("settings"))?.etaRouteNum || "3個";

  const defaultScreenOptions = [
    { name: "路線搜尋", icon: <DirectionsBusIcon /> },
    { name: "交通消息", icon: <AnnouncementIcon /> },
    { name: "收藏", icon: <FavoriteIcon /> },
    { name: "天氣", icon: <ThermostatIcon /> },
  ];

  const bookmarkDisplayOptions = [
    { name: "簡短路線班次排序", icon: <AccessTimeIcon /> },
    { name: "所有路線班次排序", icon: <DepartureBoardIcon /> },
    { name: "詳細路線班次", icon: <TableViewIcon /> },
  ];

  const etaRouteNumOptions = [
    { name: "1個", icon: <Filter1Icon /> },
    { name: "2個", icon: <Filter2Icon /> },
    { name: "3個", icon: <Filter3Icon /> },
    { name: "4個", icon: <Filter4Icon /> },
    { name: "5個", icon: <Filter5Icon /> },
    { name: "6個", icon: <Filter6Icon /> },
    { name: "7個", icon: <Filter7Icon /> },
    { name: "8個", icon: <Filter8Icon /> },
    { name: "9個", icon: <Filter9Icon /> },
  ];

  const handleDefaltScreenItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("預設載入版面");
    setDialogKey("defaultScreen");
    setDialogOptions(defaultScreenOptions);
  };

  const handleBookmarkDisplayItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("預設收藏顯示模式");
    setDialogKey("bookmarkDisplay");
    setDialogOptions(bookmarkDisplayOptions);
  };

  const handleEtaRouteNumItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("到站時間路線排序顯示數目");
    setDialogKey("etaRouteNum");
    setDialogOptions(etaRouteNumOptions);
  };

  return (
    <>
      <List subheader={<ListSubheader>應用程式</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleDefaltScreenItemOnClick}>
            <ListItemAvatar>
              <Avatar>
                {
                  defaultScreenOptions.filter(
                    (e) => e.name === defaultScreen
                  )[0].icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="預設載入版面" secondary={defaultScreen} />
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>收藏</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleBookmarkDisplayItemOnClick}>
            <ListItemAvatar>
              <Avatar>
                {
                  bookmarkDisplayOptions.filter(
                    (e) => e.name === bookmarkDisplay
                  )[0].icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="預設顯示模式" secondary={bookmarkDisplay} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleEtaRouteNumItemOnClick}
            disabled={bookmarkDisplay === "所有路線班次排序"}
          >
            <ListItemAvatar>
              <Avatar>
                {
                  etaRouteNumOptions.filter((e) => e.name === etaRouteNum)[0]
                    .icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="簡短班次路線顯示數目"
              secondary={
                bookmarkDisplay === "所有路線班次排序" ? "不適用" : etaRouteNum
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
      <SimpleSettingDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogTitle={dialogTitle}
        dialogOptions={dialogOptions}
        dialogKey={dialogKey}
      />
    </>
  );
};
