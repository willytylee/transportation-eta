import { useContext } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { EtaContext } from "../../context/EtaContext";
import { serviceDate } from "../../constants/Constants";

export const SortingDialog = ({ sortingDialogOpen, setSortingDialogOpen }) => {
  const handleDialogOnClose = () => {
    setSortingDialogOpen(false);
  };

  const handleListItemOnClick = () => {
    setSortingDialogOpen(false);
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
              handleListItemOnClick("最短總距離");
            }}
          >
            <ListItemText primary="最短總距離" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleListItemOnClick("最短步行距離");
            }}
          >
            <ListItemText primary="最短步行距離" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleListItemOnClick("最短交通距離");
            }}
          >
            <ListItemText primary="最短交通距離" />
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
