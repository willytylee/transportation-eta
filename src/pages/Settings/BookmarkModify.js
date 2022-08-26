import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material/";

import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { BookmarkDialog } from "../../components/Settings/BookmarkDialog";

export const BookmarkModify = () => {
  const [bookmarkDialogMode, setBookmarkDialogMode] = useState(null);

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setBookmarkDialogMode("category")}>
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="新增 / 編輯 / 刪除" />
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
