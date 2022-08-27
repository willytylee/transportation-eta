import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material/";
import { useSnackbar } from "notistack";
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { BookmarkDialog } from "../../components/Settings/BookmarkDialog";

export const BookmarkModify = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [bookmarkDialogMode, setBookmarkDialogMode] = useState(null);

  const handleClearBtnOnClick = (i) => {
    const action = (snackbarId) => (
      <>
        <IconButton
          className="deleteBtn"
          onClick={() => {
            localStorage.removeItem("bookmark");
            localStorage.removeItem("user");
            closeSnackbar(snackbarId);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </>
    );

    enqueueSnackbar("確定刪除收藏 ?", {
      variant: "warning",
      autoHideDuration: 5000,
      action,
    });
  };

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setBookmarkDialogMode("category")}>
            <ListItemAvatar>
              <Avatar>
                <EditIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="新增, 編輯或刪除" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={handleClearBtnOnClick}>
            <ListItemAvatar>
              <Avatar>
                <DeleteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="一鍵清除收藏 (請謹慎使用)" />
          </ListItemButton>
        </ListItem>
      </List>
      <BookmarkDialog
        bookmarkDialogMode={bookmarkDialogMode}
        setBookmarkDialogMode={setBookmarkDialogMode}
      />
    </>
  );
};
