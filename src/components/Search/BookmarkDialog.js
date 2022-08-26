import { useState } from "react";
import { compress as compressJson } from "lzutf8-light";
import { useSnackbar } from "notistack";
import { styled, Dialog } from "@mui/material/";
import { FormDialog } from "../BookmarkDialog/FormDialog";
import { getLocalStorage } from "../../Utils/Utils";
import { ListDialog } from "../BookmarkDialog/ListDialog";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
  bookmarkRouteObj,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [categoryValue, setCategoryValue] = useState("");
  const _transportData = getLocalStorage("bookmark") || [];
  const [transportData, setTransportData] = useState(_transportData);

  const handleDialogCloseBtnOnClick = () => {
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  // -------------------- Category --------------------

  const handleCategoryItemOnClick = (i) => {
    setCategoryIdx(i);
    setBookmarkDialogMode("section");
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
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(_transportData), { outputEncoding: "Base64" })
    );
    setBookmarkDialogMode("category");
    setCategoryValue("");
  };

  const handleCategoryAddKeyPress = (e) => {
    e.key === "Enter" && handleCategoryConfirmBtnOnClick();
  };

  // -------------------- Section --------------------

  const handleSectionItemOnClick = (i) => {
    _transportData[categoryIdx].data[i].push(bookmarkRouteObj);
    setTransportData(_transportData);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(_transportData), { outputEncoding: "Base64" })
    );
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmark_nocompress",
        JSON.stringify(_transportData)
      );
    }
    enqueueSnackbar(
      `成功加入路線 ${bookmarkRouteObj.route} 到: ${
        transportData[categoryIdx].title
      } → 組合${i + 1}`,
      {
        variant: "success",
      }
    );
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  const handleSectionAddBtnOnClick = () => {
    _transportData[categoryIdx].data.push([]);
    setTransportData(_transportData);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(_transportData), { outputEncoding: "Base64" })
    );
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmark_nocompress",
        JSON.stringify(_transportData)
      );
    }
  };

  const handleSectionBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth
    >
      {bookmarkDialogMode === "category" && (
        <ListDialog
          title="請選擇類別"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleCategoryItemOnClick}
          handleAddBtnOnClick={handleCategoryAddBtnOnClick}
          data={transportData}
          bookmarkDialogMode={bookmarkDialogMode}
          emptyMsg="未有類別"
        />
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <FormDialog
          title="新增類別"
          label="類別名稱"
          value={categoryValue}
          setValue={setCategoryValue}
          handleDialogCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleCategoryAddBackBtnOnClick}
          handleConfirmBtnOnClick={handleCategoryConfirmBtnOnClick}
          handleAddKeyPress={handleCategoryAddKeyPress}
        />
      )}
      {bookmarkDialogMode === "section" && (
        <ListDialog
          title="請選擇組合"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleSectionItemOnClick}
          handleAddBtnOnClick={handleSectionAddBtnOnClick}
          data={transportData[categoryIdx].data}
          bookmarkDialogMode={bookmarkDialogMode}
          handleBackBtnOnClick={handleSectionBackBtnOnClick}
          emptyMsg="未有組合"
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
