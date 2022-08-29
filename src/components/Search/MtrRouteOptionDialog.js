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
  bookmarkRouteObj,
  currRoute,
}) => (
  <DialogRoot
    // onClose={handleDialogCloseBtnOnClick}
    open={mtrRouteOptionDialogOpen}
    fullWidth
  >
    <DialogTitle>
      <Grid>
        <div className="title">請選擇方向</div>
        <div className="rightBtnGroup">
          <IconButton>
            <CloseIcon />
          </IconButton>
        </div>
      </Grid>
    </DialogTitle>

    <List sx={{ pt: 0 }}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText
            primary={`${stationMap[bookmarkRouteObj.stopId]} 去 ${
              currRoute.orig.zh
            }`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText
            primary={`${stationMap[bookmarkRouteObj.stopId]} 去 ${
              currRoute.dest.zh
            }`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="兩邊方向" />
        </ListItemButton>
      </ListItem>
    </List>
  </DialogRoot>
);

const DialogRoot = styled(Dialog)({
  ".emptyMsg .MuiListItemText-root .MuiListItemText-primary": {
    width: "100%",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
  },
});
