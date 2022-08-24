import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  styled,
  Grid,
  IconButton,
  DialogTitle,
} from "@mui/material/";
import {
  Close as CloseIcon,
  DirectionsBus as DirectionsBusIcon,
  Thermostat as ThermostatIcon,
  Favorite as FavoriteIcon,
  Announcement as AnnouncementIcon,
} from "@mui/icons-material";

export const DefaultScrnDialog = ({
  fullWidth,
  defaultScrnDialogOpen,
  setDefaultScrnDialogOpen,
}) => {
  const handleListItemOnClick = (e) => {
    const orig_obj = JSON.parse(localStorage.getItem("settings"));
    const new_obj = { ...orig_obj, defaultScreen: e };
    localStorage.setItem("settings", JSON.stringify(new_obj));
    setDefaultScrnDialogOpen(false);
  };

  return (
    <DialogRoot
      onClose={() => {
        setDefaultScrnDialogOpen(false);
      }}
      open={defaultScrnDialogOpen}
      fullWidth={fullWidth}
    >
      <>
        <DialogTitle>
          <Grid>
            <div className="title">預設載入版面</div>
            <div className="rightBtnGroup">
              <IconButton onClick={() => setDefaultScrnDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </Grid>
        </DialogTitle>

        <List sx={{ pt: 0 }}>
          <ListItem
            button
            onClick={() => {
              handleListItemOnClick("路線搜尋");
            }}
          >
            <ListItemIcon>
              <DirectionsBusIcon />
            </ListItemIcon>
            <ListItemText primary="路線搜尋" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleListItemOnClick("交通消息");
            }}
          >
            <ListItemIcon>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="交通消息" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleListItemOnClick("收藏");
            }}
          >
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="收藏" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              handleListItemOnClick("天氣");
            }}
          >
            <ListItemIcon>
              <ThermostatIcon />
            </ListItemIcon>
            <ListItemText primary="天氣" />
          </ListItem>
        </List>
      </>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
  },
});
