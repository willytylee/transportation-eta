import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material/";
import {
  DirectionsBus as DirectionsBusIcon,
  Settings as SettingsIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { SelectUserDialog } from "../components/SelectUserDialog";
import { SwitchUserSnackBar } from "../components/SwitchUserSnackBar";

export const BottomNav = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const handleOnChange = useCallback(
    (value) => {
      switch (value) {
        case 0:
          navigate("/search", { replace: true });
          break;
        case 1:
          const user = localStorage.getItem("user");
          if (!user) {
            setDialogOpen(true);
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

  const handleDialogOnClose = useCallback(
    ({ user, name }) => {
      if (user) {
        localStorage.setItem("user", user);
        setUsername(name);
        setSnackbarOpen(true);
        navigate(`/personalAsst/${user}`, { replace: true });
      }
      setDialogOpen(false);
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
      <SelectUserDialog
        dialogOpen={dialogOpen}
        handleDialogOnClose={handleDialogOnClose}
      />
      <SwitchUserSnackBar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        username={username}
      />
    </>
  );
};

const navigationSx = {
  width: "100%",
  backgroundColor: "#f9f9f9",
};
