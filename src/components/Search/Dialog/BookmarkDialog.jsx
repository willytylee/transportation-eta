import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { styled, Dialog } from "@mui/material/";
import { getLocalStorage, setLocalStorage } from "../../../utils/Utils";
import { FormDialog } from "../../BookmarkDialog/FormDialog";
import { ListDialog } from "../../BookmarkDialog/ListDialog";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
  bookmarkData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [categoryValue, setCategoryValue] = useState("");
  const [transportData, setTransportData] = useState("");

  let _transportData = "";

  try {
    _transportData = getLocalStorage("bookmarkV2") || [];
  } catch (error) {
    _transportData = [];
  }

  useEffect(() => {
    setTransportData(_transportData);
  }, [localStorage.getItem("bookmarkV2")]);

  const handleDialogCloseBtnOnClick = () => {
    setBookmarkDialogMode(null);
  };

  // -------------------- Category --------------------

  const handleCategoryItemOnClick = (i) => {
    _transportData[i].data.push(bookmarkData);
    setTransportData(_transportData);
    setLocalStorage("bookmarkV2", _transportData);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmarkV2_nocompress",
        JSON.stringify(_transportData)
      );
    }
    enqueueSnackbar(
      `成功加入路線 ${bookmarkData.routeKey.split("+")[0]} 到: ${
        transportData[i].title
      }`,
      {
        variant: "success",
      }
    );
  };

  const handleCategoryAddBtnOnClick = () => {
    setBookmarkDialogMode("categoryAdd");
  };

  // -------------------- Category Add --------------------

  const handleCategoryAddBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  const handleCategoryConfirmBtnOnClick = () => {
    _transportData.push({
      title: categoryValue,
      data: [],
    });
    setTransportData(_transportData);
    setLocalStorage("bookmarkV2", _transportData);
    setBookmarkDialogMode("category");
    setCategoryValue("");
  };

  const handleCategoryAddKeyPress = (e) => {
    e.key === "Enter" && handleCategoryConfirmBtnOnClick();
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth
      maxWidth="xl"
    >
      {bookmarkDialogMode === "category" && (
        <ListDialog
          title="加入書籤"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleCategoryItemOnClick}
          handleAddBtnOnClick={handleCategoryAddBtnOnClick}
          data={transportData}
          bookmarkDialogMode={bookmarkDialogMode}
          emptyMsg="未有分類, 請按此新增分類"
        />
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <FormDialog
          title="新增分類"
          label="分類名稱"
          placeholder="上班"
          value={categoryValue}
          setValue={setCategoryValue}
          handleDialogCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleCategoryAddBackBtnOnClick}
          handleConfirmBtnOnClick={handleCategoryConfirmBtnOnClick}
          handleAddKeyPress={handleCategoryAddKeyPress}
        />
      )}
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
  },
});
