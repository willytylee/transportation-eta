import { useContext } from "react";
import { NavLink } from "react-router-dom";
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
import { primaryColor } from "../constants/Constants";

export const BottomNav = () => {
  const { appVersion, serVersion } = useContext(AppContext);

  const activeStyle = {
    backgroundColor: `${primaryColor}`,
    color: "white",
  };

  return (
    <BottomNavigationRoot showLabels>
      <BottomNavigationAction
        component={NavLink}
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
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
      <BottomNavigationAction
        component={NavLink}
        to="/bookmark"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        label="收藏"
        icon={<FavoriteIcon />}
      />
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
