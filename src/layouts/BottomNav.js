import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { BottomNavigation, BottomNavigationAction } from "@mui/material/";
import {
  DirectionsBus as DirectionsBusIcon,
  Settings as SettingsIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
  Announcement as AnnouncementIcon,
} from "@mui/icons-material";

export const BottomNav = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const handleOnChange = useCallback(
    (value) => {
      switch (value) {
        case 0:
          navigate("/search", { replace: true });
          break;
        case 1:
          navigate("/news", { replace: true });
          break;
        case 2:
          let userId;
          try {
            userId = JSON.parse(localStorage.getItem("user")).userId;
            navigate(`/personalAsst/${userId}`, { replace: true });
          } catch (error) {
            enqueueSnackbar("請選擇用戶", {
              variant: "warning",
            });
            navigate("/settings", { replace: true });
          }
          break;
        case 3:
          navigate("/weather", { replace: true });
          break;
        case 4:
          navigate("/settings", { replace: true });
          break;
        default:
          break;
      }
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
        <BottomNavigationAction label="交通消息" icon={<AnnouncementIcon />} />
        <BottomNavigationAction label="收藏" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="天氣" icon={<ThermostatIcon />} />
        <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
      </BottomNavigation>
    </>
  );
};

const navigationSx = {
  width: "100%",
  backgroundColor: "#f9f9f9",
};
