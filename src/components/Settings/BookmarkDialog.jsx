import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { styled, Dialog, IconButton } from "@mui/material/";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { FormDialog } from "../BookmarkDialog/FormDialog";
import { getLocalStorage, setLocalStorage } from "../../Utils/Utils";
import { ListBtnDialog } from "../BookmarkDialog/ListBtnDialog";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [formValue, setFormValue] = useState("");
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
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  // -------------------- Category  --------------------

  const handleCategoryItemOnClick = (i) => {
    setCategoryIdx(i);
    setBookmarkDialogMode("route");
  };

  const handleCategoryAddBtnOnClick = () => {
    setBookmarkDialogMode("categoryAdd");
  };

  const handleCategoryEditBtnOnClick = (i) => {
    setCategoryIdx(i);
    setBookmarkDialogMode("categoryEdit");
  };

  const handleCategoryDeleteBtnOnClick = (i) => {
    const action = (snackbarId) => (
      <>
        <IconButton
          className="deleteBtn"
          onClick={() => {
            _transportData.splice(i, 1);
            setTransportData(_transportData);
            setLocalStorage("bookmarkV2", _transportData);
            if (
              !process.env.NODE_ENV ||
              process.env.NODE_ENV === "development"
            ) {
              localStorage.setItem(
                "bookmark_nocompress",
                JSON.stringify(_transportData)
              );
            }
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

    enqueueSnackbar(`確定刪除 ${transportData[i].title} ?`, {
      variant: "warning",
      autoHideDuration: 5000,
      action,
    });
  };

  // -------------------- Category Add --------------------

  const handleCategoryAddBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  const handleCategoryAddConfirmBtnOnClick = () => {
    _transportData.push({
      title: formValue,
      data: [],
    });
    setTransportData(_transportData);
    setLocalStorage("bookmarkV2", _transportData);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmark_nocompress",
        JSON.stringify(_transportData)
      );
    }
    setBookmarkDialogMode("category");
    setFormValue("");
  };

  const handleCategoryAddKeyPress = (e) => {
    e.key === "Enter" && handleCategoryAddConfirmBtnOnClick();
  };

  // -------------------- Category Edit --------------------

  const handleCategoryEditBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  const handleCategoryEditConfirmBtnOnClick = () => {
    _transportData[categoryIdx].title = formValue;
    setTransportData(_transportData);
    setLocalStorage("bookmarkV2", _transportData);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmark_nocompress",
        JSON.stringify(_transportData)
      );
    }
    setBookmarkDialogMode("category");
    setFormValue("");
  };

  const handleCategoryEditKeyPress = (e) => {
    e.key === "Enter" && handleCategoryEditConfirmBtnOnClick();
  };

  // -------------------- Route --------------------

  const handleRouteBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  const handleRouteDeleteBtnOnClick = (i) => {
    const routeData = transportData[categoryIdx].data[i];
    const { routeKey } = routeData;
    const route = routeKey ? routeData.routeKey.split("+")[0] : routeData.route;
    const action = (snackbarId) => (
      <>
        <IconButton
          className="deleteBtn"
          onClick={() => {
            _transportData[categoryIdx].data.splice(i, 1);
            setTransportData(_transportData);
            setLocalStorage("bookmarkV2", _transportData);
            if (
              !process.env.NODE_ENV ||
              process.env.NODE_ENV === "development"
            ) {
              localStorage.setItem(
                "bookmarkV2_nocompress",
                JSON.stringify(_transportData)
              );
            }
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

    enqueueSnackbar(`確定刪除 ${route} ?`, {
      variant: "warning",
      autoHideDuration: 5000,
      action,
    });
  };

  // ------------------------------------------------

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth
    >
      {bookmarkDialogMode === "category" && (
        <ListBtnDialog
          title="設定分類"
          emptyMsg="未有分類, 請按此新增分類"
          addLabel="新增分類"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleCategoryItemOnClick}
          handleAddBtnOnClick={handleCategoryAddBtnOnClick}
          handleEditBtnOnClick={handleCategoryEditBtnOnClick}
          handleDeleteBtnOnClick={handleCategoryDeleteBtnOnClick}
          data={transportData}
          bookmarkDialogMode={bookmarkDialogMode}
        />
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <FormDialog
          title="新增分類"
          label="分類名稱"
          placeholder="上班"
          value={formValue}
          setValue={setFormValue}
          handleDialogCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleCategoryAddBackBtnOnClick}
          handleConfirmBtnOnClick={handleCategoryAddConfirmBtnOnClick}
          handleAddKeyPress={handleCategoryAddKeyPress}
        />
      )}
      {bookmarkDialogMode === "categoryEdit" && (
        <FormDialog
          title="重新命名分類"
          label="分類名稱"
          placeholder="上班"
          value={formValue}
          setValue={setFormValue}
          handleDialogCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleCategoryEditBackBtnOnClick}
          handleConfirmBtnOnClick={handleCategoryEditConfirmBtnOnClick}
          handleAddKeyPress={handleCategoryEditKeyPress}
        />
      )}
      {bookmarkDialogMode === "route" && (
        <ListBtnDialog
          title={`設定 ${_transportData[categoryIdx].title} 路線`}
          emptyMsg="未有路線"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleRouteBackBtnOnClick}
          handleDeleteBtnOnClick={handleRouteDeleteBtnOnClick}
          data={transportData[categoryIdx].data}
          bookmarkDialogMode={bookmarkDialogMode}
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
