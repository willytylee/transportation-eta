import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { compress as compressJson } from "lzutf8-light";
import { styled, Dialog, IconButton } from "@mui/material/";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { FormDialog } from "../BookmarkDialog/FormDialog";
import { getLocalStorage } from "../../Utils/Utils";
import { ListBtnDialog } from "../BookmarkDialog/ListBtnDialog";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [sectionIdx, setSectionIdx] = useState(-1);
  const [formValue, setFormValue] = useState("");
  const _transportData = getLocalStorage("bookmark") || [];
  const [transportData, setTransportData] = useState(_transportData);

  const handleDialogCloseBtnOnClick = () => {
    setCategoryIdx(-1);
    setSectionIdx(-1);
    setBookmarkDialogMode(null);
  };

  // -------------------- Category  --------------------

  const handleCategoryItemOnClick = (i) => {
    setCategoryIdx(i);
    setBookmarkDialogMode("section");
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
            localStorage.setItem(
              "bookmark",
              compressJson(JSON.stringify(_transportData), {
                outputEncoding: "Base64",
              })
            );
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
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(_transportData), { outputEncoding: "Base64" })
    );
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
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(_transportData), { outputEncoding: "Base64" })
    );
    setBookmarkDialogMode("category");
    setFormValue("");
  };

  const handleCategoryEditKeyPress = (e) => {
    e.key === "Enter" && handleCategoryEditConfirmBtnOnClick();
  };

  // -------------------- Section --------------------

  const handleSectionItemOnClick = (i) => {
    setSectionIdx(i);
    setBookmarkDialogMode("route");
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

  const handleSectionDeleteBtnOnClick = (i) => {
    const action = (snackbarId) => (
      <>
        <IconButton
          className="deleteBtn"
          onClick={() => {
            _transportData[categoryIdx].data.splice(i, 1);
            setTransportData(_transportData);
            localStorage.setItem(
              "bookmark",
              compressJson(JSON.stringify(_transportData), {
                outputEncoding: "Base64",
              })
            );
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

    enqueueSnackbar(`確定刪除 組合${i + 1} ?`, {
      variant: "warning",
      autoHideDuration: 5000,
      action,
    });
  };

  // -------------------- Route --------------------

  const handleRouteBackBtnOnClick = () => {
    setBookmarkDialogMode("section");
  };

  const handleRouteAddBtnOnClick = () => {
    navigate("/search", { replace: true });
  };

  const handleRouteDeleteBtnOnClick = (i) => {
    const action = (snackbarId) => (
      <>
        <IconButton
          className="deleteBtn"
          onClick={() => {
            _transportData[categoryIdx].data[sectionIdx].splice(i, 1);
            setTransportData(_transportData);
            localStorage.setItem(
              "bookmark",
              compressJson(JSON.stringify(_transportData), {
                outputEncoding: "Base64",
              })
            );
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

    enqueueSnackbar(
      `確定刪除 ${transportData[categoryIdx].data[sectionIdx][i].route} ?`,
      {
        variant: "warning",
        autoHideDuration: 5000,
        action,
      }
    );
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
          title="新增 / 編輯 / 刪除"
          emptyMsg="未有類別"
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
          title="新增類別"
          label="類別名稱"
          placeholder="上班 / 回家"
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
          title="重新命名類別"
          label="類別名稱"
          placeholder="上班 / 回家"
          value={formValue}
          setValue={setFormValue}
          handleDialogCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleCategoryEditBackBtnOnClick}
          handleConfirmBtnOnClick={handleCategoryEditConfirmBtnOnClick}
          handleAddKeyPress={handleCategoryEditKeyPress}
        />
      )}
      {bookmarkDialogMode === "section" && (
        <ListBtnDialog
          title={_transportData[categoryIdx].title}
          emptyMsg="未有組合"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleItemOnClick={handleSectionItemOnClick}
          handleAddBtnOnClick={handleSectionAddBtnOnClick}
          handleBackBtnOnClick={handleSectionBackBtnOnClick}
          handleDeleteBtnOnClick={handleSectionDeleteBtnOnClick}
          data={transportData[categoryIdx].data}
          bookmarkDialogMode={bookmarkDialogMode}
        />
      )}
      {bookmarkDialogMode === "route" && (
        <ListBtnDialog
          title={`組合${sectionIdx + 1}`}
          emptyMsg="未有路線"
          handleCloseBtnOnClick={handleDialogCloseBtnOnClick}
          handleBackBtnOnClick={handleRouteBackBtnOnClick}
          handleAddBtnOnClick={handleRouteAddBtnOnClick}
          handleDeleteBtnOnClick={handleRouteDeleteBtnOnClick}
          data={transportData[categoryIdx].data[sectionIdx]}
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
