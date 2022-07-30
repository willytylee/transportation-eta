import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material/";
import {
  DirectionsBus as DirectionsBusIcon,
  Settings as SettingsIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { SimpleDialog } from "../components/SimpleDialog";

export const BottomNav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOnChange = useCallback(
    (value) => {
      switch (value) {
        case 0:
          navigate("/search", { replace: true });
          break;
        case 1:
          const user = localStorage.getItem("user");
          if (!user) {
            setOpen(true);
          } else {
            navigate(`/personalAsst/${user}`, { replace: true });
          }
          break;
        case 2:
          navigate("/weather", { replace: true });
          break;
        case 3:
          navigate("/settings", { replace: true });
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  const handleDialogClose = useCallback(
    (value) => {
      if (value) {
        localStorage.setItem("user", value);
        navigate(`/personalAsst/${value}`, { replace: true });
      }
      setOpen(false);
    },
    [navigate]
  );

  return (
    <>
      <BottomNavigation
        sx={navigationSx}
        showLabels
        onChange={(e, value) => {
          handleOnChange(value);
        }}
      >
        <BottomNavigationAction label="路線搜尋" icon={<DirectionsBusIcon />} />
        <BottomNavigationAction label="收藏" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="天氣" icon={<ThermostatIcon />} />
        <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
      </BottomNavigation>
      <SimpleDialog open={open} onClose={handleDialogClose} />
    </>
  );
};

const navigationSx = {
  width: "100%",
  backgroundColor: "#f9f9f9",
};
