import { useContext } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DirectionContext } from "../../context/DirectionContext";

export const SortingDialog = () => {
  const { sortingDialogOpen, updateSortingDialogOpen, updateSortingMethod } =
    useContext(DirectionContext);

  const handleDialogOnClose = () => {
    updateSortingDialogOpen(false);
  };

  const handleListItemOnClick = (method) => {
    updateSortingMethod(method);
    updateSortingDialogOpen(false);
  };

  return (
    <DialogRoot
      open={sortingDialogOpen}
      onClose={handleDialogOnClose}
      fullWidth
    >
      <DialogTitle>
        <Grid>
          <div className="title">排序方式</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogOnClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleListItemOnClick("最短總時間");
            }}
          >
            <ListItemText primary="最短總時間" secondary="等候時間不計算在內" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleListItemOnClick("最短步行時間");
            }}
          >
            <ListItemText primary="最短步行時間" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleListItemOnClick("最短交通時間");
            }}
          >
            <ListItemText primary="最短交通時間" />
          </ListItemButton>
        </ListItem>
      </List>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiDialogContent-root": {
    paddingTop: "20px !important",
    ".dateWrapper": {
      padding: "6px 0",
      ".timeFreqGroup": {
        fontSize: "14px",
        ".timeFreqWrapper": {
          display: "flex",
          alignItems: "center",
          gap: "28px",
          "&.bold": {
            fontWeight: 900,
          },
        },
      },
    },
  },
});
