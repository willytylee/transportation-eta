import {
  List,
  ListItem,
  Grid,
  IconButton,
  DialogTitle,
  ListItemButton,
  styled,
  Dialog,
  ListItemText,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { stationMap } from "../../constants/Mtr";

export const MtrRouteOptionDialog = ({
  mtrRouteOptionDialogOpen,
  setBookmarkDialogMode,
  bookmarkRouteObj,
  currRoute,
  setBookmarkRouteObj,
  setMtrRouteOptionDialogOpen,
}) => {
  const handleItemButtonOnClick = (bound) => {
    setBookmarkDialogMode("category");
    setBookmarkRouteObj({
      ...bookmarkRouteObj,
      bound,
    });
    setMtrRouteOptionDialogOpen(false);
  };

  const handleCloseBtnOnClick = () => {
    setMtrRouteOptionDialogOpen(false);
  };

  return (
    <DialogRoot
      onClose={handleCloseBtnOnClick}
      open={mtrRouteOptionDialogOpen}
      fullWidth
    >
      <DialogTitle>
        <Grid>
          <div className="title">請選擇方向</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleCloseBtnOnClick}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>

      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleItemButtonOnClick(["up"]);
            }}
          >
            <ListItemText
              primary={`${stationMap[bookmarkRouteObj.stopId]} 去 ${
                currRoute?.orig?.zh
              }`}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleItemButtonOnClick(["down"]);
            }}
          >
            <ListItemText
              primary={`${stationMap[bookmarkRouteObj.stopId]} 去 ${
                currRoute?.dest?.zh
              }`}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleItemButtonOnClick(["up", "down"]);
            }}
          >
            <ListItemText primary="加入兩邊方向" />
          </ListItemButton>
        </ListItem>
      </List>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".emptyMsg .MuiListItemText-root .MuiListItemText-primary": {
    width: "100%",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
  },
});
