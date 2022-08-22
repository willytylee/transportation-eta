import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  styled,
} from "@mui/material/";
import {
  DirectionsBus as DirectionsBusIcon,
  Settings as SettingsIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
  Announcement as AnnouncementIcon,
} from "@mui/icons-material";
import { AppContext } from "../context/AppContext";
import { EtaContext } from "../context/EtaContext";

export const BottomNav = () => {
  const { appVersion, serVersion, currentUserId } = useContext(AppContext);
  const { updateSectionCompareMode } = useContext(EtaContext);
  const { enqueueSnackbar } = useSnackbar();
  const { pathname } = useLocation();

  const activeStyle = {
    background: "#2f305c",
    color: "white",
  };

  return (
    <BottomNavigationRoot showLabels>
      <BottomNavigationAction
        component={NavLink}
        style={({ isActive }) =>
          isActive || ["/", "/search"].includes(pathname)
            ? activeStyle
            : undefined
        }
        to="/search"
        label="路線搜尋"
        icon={<DirectionsBusIcon />}
      />
      <BottomNavigationAction
        component={NavLink}
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        to="/news"
        label="交通消息"
        icon={<AnnouncementIcon />}
      />
      {currentUserId === -1 ? (
        <BottomNavigationAction
          component={NavLink}
          to="/settings"
          onClick={() => {
            enqueueSnackbar("請選擇用戶", {
              variant: "warning",
            });
          }}
          label="收藏"
          icon={<FavoriteIcon />}
        />
      ) : (
        <BottomNavigationAction
          component={NavLink}
          to={`/bookmark/${currentUserId}`}
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          label="收藏"
          icon={<FavoriteIcon />}
          onClick={() => {
            updateSectionCompareMode(false);
          }}
        />
      )}
      <BottomNavigationAction
        component={NavLink}
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        to="/weather"
        label="天氣"
        icon={<ThermostatIcon />}
      />
      <BottomNavigationAction
        label="設定"
        component={NavLink}
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        to="/settings"
        icon={
          <Badge
            color="primary"
            variant="dot"
            overlap="circular"
            invisible={appVersion === serVersion}
          >
            <SettingsIcon />
          </Badge>
        }
      />
    </BottomNavigationRoot>
  );
};

const BottomNavigationRoot = styled(BottomNavigation)({
  width: "100%",
  backgroundColor: "#f9f9f9",
  ".MuiButtonBase-root": {
    padding: 0,
    minWidth: "unset",
    maxWidth: "unset",
    border: "2px white solid",
    color: "#2f305c",
  },
});
