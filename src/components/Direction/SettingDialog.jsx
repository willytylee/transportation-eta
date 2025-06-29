import { useContext } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  Dialog,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DirectionContext } from "../../context/DirectionContext";

export const SettingDialog = () => {
  const {
    settingDialogOpen,
    updateSettingDialogOpen,
    updateSortingDialogOpen,
    updateDisplayDialogOpen,
  } = useContext(DirectionContext);

  const handleDialogOnClose = () => {
    updateSettingDialogOpen(false);
  };

  const handleItemOnClick = (e) => {
    switch (e) {
      case "排序方式":
        updateSettingDialogOpen(false);
        updateSortingDialogOpen(true);
        break;

      case "顯示設定":
        updateSettingDialogOpen(false);
        updateDisplayDialogOpen(true);
        break;

      default:
        break;
    }
    // updateSettingMethod(e.target.value);
  };

  return (
    <DialogRoot
      open={settingDialogOpen}
      onClose={handleDialogOnClose}
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle>
        <Grid>
          <div className="title">設定</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogOnClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>

      <List sx={{ pt: 0, pb: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleItemOnClick("排序方式");
            }}
          >
            <ListItemText primary="排序方式" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleItemOnClick("顯示設定");
            }}
          >
            <ListItemText primary="顯示設定" />
          </ListItemButton>
        </ListItem>
      </List>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiFormControl-root": {
    padding: "8px",
    ".MuiFormControlLabel-root": {
      margin: 0,
      padding: "6px 0",
    },
  },
});
