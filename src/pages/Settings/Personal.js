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
  ManageSearch as ManageSearchIcon,
  SavedSearch as SavedSearchIcon,
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
    "簡短班次排序";
  const etaRouteNum =
    JSON.parse(localStorage.getItem("settings"))?.etaRouteNum || "5個";
  const searchMethod =
    JSON.parse(localStorage.getItem("settings"))?.searchMethod || "搜尋路線";

  const defaultScreenOptions = [
    { primary: "路線搜尋", icon: <DirectionsBusIcon /> },
    { primary: "交通消息", icon: <AnnouncementIcon /> },
    { primary: "收藏", icon: <FavoriteIcon /> },
    { primary: "天氣", icon: <ThermostatIcon /> },
  ];

  const bookmarkDisplayOptions = [
    { primary: "簡短班次排序", icon: <AccessTimeIcon /> },
    { primary: "所有班次排序", icon: <DepartureBoardIcon /> },
    { primary: "詳細路線班次", icon: <TableViewIcon /> },
  ];

  const etaRouteNumOptions = [
    { primary: "1個", icon: <Filter1Icon /> },
    { primary: "2個", icon: <Filter2Icon /> },
    { primary: "3個", icon: <Filter3Icon /> },
    { primary: "4個", icon: <Filter4Icon /> },
    { primary: "5個", icon: <Filter5Icon /> },
    { primary: "6個", icon: <Filter6Icon /> },
    { primary: "7個", icon: <Filter7Icon /> },
    { primary: "8個", icon: <Filter8Icon /> },
    { primary: "9個", icon: <Filter9Icon /> },
  ];

  const searchMethodOptions = [
    {
      primary: "搜尋路線",
      secondary: "自動列出所有包含搜尋號碼字眼路線, 運算較快手機適用",
      icon: <ManageSearchIcon />,
    },
    {
      primary: "交通路線",
      secondary: "只列出搜尋號碼字眼路線, 運算較慢手機適用",
      icon: <SavedSearchIcon />,
    },
  ];

  const handleDefaltScreenItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("預設版面");
    setDialogKey("defaultScreen");
    setDialogOptions(defaultScreenOptions);
  };

  const handleBookmarkDisplayItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("收藏顯示模式");
    setDialogKey("bookmarkDisplay");
    setDialogOptions(bookmarkDisplayOptions);
  };

  const handleEtaRouteNumItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("簡短班次路線顯示數目");
    setDialogKey("etaRouteNum");
    setDialogOptions(etaRouteNumOptions);
  };

  const handleSearchMethodItemOnClick = () => {
    setDialogOpen(true);
    setDialogTitle("路線搜尋模式");
    setDialogKey("searchMethod");
    setDialogOptions(searchMethodOptions);
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
                    (e) => e.primary === defaultScreen
                  )[0]?.icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="預設版面" secondary={defaultScreen} />
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>路線搜尋</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSearchMethodItemOnClick}>
            <ListItemAvatar>
              <Avatar>
                {
                  searchMethodOptions.filter(
                    (e) => e.primary === searchMethod
                  )[0]?.icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="路線搜尋模式" secondary={searchMethod} />
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
                    (e) => e.primary === bookmarkDisplay
                  )[0]?.icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="顯示模式" secondary={bookmarkDisplay} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleEtaRouteNumItemOnClick}
            disabled={bookmarkDisplay === "所有班次排序"}
          >
            <ListItemAvatar>
              <Avatar>
                {
                  etaRouteNumOptions.filter((e) => e.primary === etaRouteNum)[0]
                    ?.icon
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="簡短班次路線顯示數目"
              secondary={
                bookmarkDisplay === "所有班次排序" ? "不適用" : etaRouteNum
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
