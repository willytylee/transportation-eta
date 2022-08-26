import { useState } from "react";
import { styled, Dialog } from "@mui/material/";
import { Category } from "./BookmarkDialog/Category";
import { CategoryAdd } from "./BookmarkDialog/CategoryAdd";
import { Section } from "./BookmarkDialog/Section";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
  bookmarkRouteObj,
}) => {
  const [categoryIdx, setCategoryIdx] = useState(-1);

  // -------------- Close Btn --------------------

  const handleDialogCloseBtnOnClick = () => {
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth
    >
      {bookmarkDialogMode === "category" && (
        <Category
          setBookmarkDialogMode={setBookmarkDialogMode}
          setCategoryIdx={setCategoryIdx}
        />
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <CategoryAdd
          setCategoryIdx={setCategoryIdx}
          setBookmarkDialogMode={setBookmarkDialogMode}
        />
      )}
      {bookmarkDialogMode === "section" && (
        <Section
          setCategoryIdx={setCategoryIdx}
          setBookmarkDialogMode={setBookmarkDialogMode}
          categoryIdx={categoryIdx}
          bookmarkRouteObj={bookmarkRouteObj}
        />
      )}
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
    paddingTop: "8px",
  },
});
