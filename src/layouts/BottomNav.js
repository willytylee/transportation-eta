import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material/";
import {
  DirectionsBus as DirectionsBusIcon,
  Settings as SettingsIcon,
  Thermostat as ThermostatIcon,
} from "@mui/icons-material";

export const BottomNav = () => {
  const navigate = useNavigate();
  const handleOnChange = useCallback(
    (value) => {
      let nav;
      switch (value) {
        case 0:
          nav = "/search";
          break;
        case 1:
          nav = "/weather";
          break;
        case 2:
          nav = "/settings";
          break;
        default:
          break;
      }
      navigate(nav, { replace: true });
    },
    [navigate]
  );

  return (
    <BottomNavigation
      sx={navigationSx}
      showLabels
      value={""}
      onChange={(e, value) => {
        handleOnChange(value);
      }}
    >
      <BottomNavigationAction label="路線搜尋" icon={<DirectionsBusIcon />} />
      <BottomNavigationAction label="天氣" icon={<ThermostatIcon />} />
      <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
};

const navigationSx = {
  width: "100%",
  backgroundColor: "#f9f9f9",
};
