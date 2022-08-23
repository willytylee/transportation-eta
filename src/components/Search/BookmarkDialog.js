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
// import { dataSet } from "../../data/DataSet";

export const BookmarkDialog = ({
  fullWidth,
  bookmarkDialogOpen,
  setBookmarkDialogOpen,
}) => {
  // const data = dataSet.find((o) => o.userId === userId);

  const handleListItemOnClick = (e) => {};

  return (
    <DialogRoot
      onClose={() => {
        setBookmarkDialogOpen(false);
      }}
      open={bookmarkDialogOpen}
      fullWidth={fullWidth}
    >
      <>
        <DialogTitle className="dialogTitle">
          <Grid>
            <div className="title">預設載入版面</div>
            <IconButton onClick={() => setBookmarkDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
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

const DialogRoot = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== "isPinValid",
})(({ isPinValid }) => ({
  ".dialogTitle": {
    padding: "0",
    ".MuiGrid-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ".title": {
        padding: "16px",
        fontWeight: "900",
        fontSize: "18px",
      },
    },
  },
  ".MuiList-root": {
    overflow: "auto",
  },
  ".pincode-input-container": {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",

    ".pincode-input-text": {
      height: "60px !important",
      borderColor: isPinValid ? "black !important" : "red !important",
      fontSize: "24px",
      borderRadius: "2px",
    },
    ".pincode-input-text:focus": {
      outline: "none",
      boxShadow: "none",
      borderColor: "blue !important",
      borderRadius: "10px",
    },
  },
}));
