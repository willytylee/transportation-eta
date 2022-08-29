import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { styled, Dialog } from "@mui/material/";
import { FormDialog } from "../BookmarkDialog/FormDialog";
import { getLocalStorage, setLocalStorage } from "../../Utils/Utils";
import { ListDialog } from "../BookmarkDialog/ListDialog";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
  bookmarkRouteObj,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [categoryValue, setCategoryValue] = useState("");
  const [transportData, setTransportData] = useState("");

  let _transportData = "";

  try {
    _transportData = getLocalStorage("bookmark") || [];
  } catch (error) {
    _transportData = [];
  }

  useEffect(() => {
    setTransportData(_transportData);
  }, [localStorage.getItem("bookmark")]);

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
    setLocalStorage("bookmark", _transportData);
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
    setLocalStorage("bookmark", _transportData);
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
    setLocalStorage("bookmark", _transportData);

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
          title="加入書籤"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleCategoryItemOnClick}
          handleAddBtnOnClick={handleCategoryAddBtnOnClick}
          data={transportData}
          bookmarkDialogMode={bookmarkDialogMode}
          emptyMsg="未有類別, 請先新增類別"
        />
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <FormDialog
          title="新增類別"
          label="類別名稱"
          placeholder="上班"
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
          title={_transportData[categoryIdx].title}
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleSectionItemOnClick}
          handleAddBtnOnClick={handleSectionAddBtnOnClick}
          data={transportData[categoryIdx].data}
          bookmarkDialogMode={bookmarkDialogMode}
          handleBackBtnOnClick={handleSectionBackBtnOnClick}
          emptyMsg="未有組合, 請先新增組合"
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
