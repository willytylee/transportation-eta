import { useState, useEffect } from "react";

import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Dialog,
} from "@mui/material/";
import { useSnackbar } from "notistack";
import { Close as CloseIcon } from "@mui/icons-material";

import { PreviewDialog } from "./PreviewDialog";

export const ImportExportDialog = ({ imExportMode, setImExportMode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [previewFrom, setPreviewFrom] = useState("");
  const [encodedData, setEncodedData] = useState("");

  useEffect(() => {
    const bookmark = localStorage.getItem("bookmark") || "W10=";
    setEncodedData(bookmark);
  }, [localStorage.getItem("bookmark")]);

  const handleDialogCloseBtnOnClick = () => {
    setImExportMode(null);
  };

  const handleimportBtnOnClick = () => {
    localStorage.setItem("bookmark", encodedData);
    enqueueSnackbar("成功匯入書籤。", {
      variant: "success",
    });
  };

  const handleExportBtnOnClick = () => {
    navigator.clipboard.writeText(encodedData);
    enqueueSnackbar("已複製資料到剪貼簿, 請妥善保管。", {
      variant: "success",
    });
  };

  const handlePreviewDialogCloseBtnOnClick = () => {
    setImExportMode(previewFrom);
  };

  const handlePreviewBtnOnClick = () => {
    setPreviewFrom(imExportMode);
    setImExportMode("preview");
  };

  const handleFormChange = (e) => {
    setEncodedData(e.target.value);
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={imExportMode !== null}
      fullWidth
    >
      {imExportMode === "import" && (
        <>
          <DialogTitle>
            <Grid>
              <div className="title">匯入書籤</div>
              <div className="rightBtnGroup">
                <IconButton onClick={handleDialogCloseBtnOnClick}>
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              variant="standard"
              label="請輸入資料"
              autoComplete="off"
              onChange={handleFormChange}
              value={encodedData}
              fullWidth
              multiline
              maxRows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewBtnOnClick}>預覽</Button>
            <Button onClick={handleimportBtnOnClick}>匯入</Button>
          </DialogActions>
        </>
      )}
      {imExportMode === "export" && (
        <ExportDialog>
          <DialogTitle>
            <Grid>
              <div className="title">匯出書籤</div>
              <div className="rightBtnGroup">
                <IconButton onClick={handleDialogCloseBtnOnClick}>
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              variant="standard"
              label="資料"
              defaultValue={encodedData}
              autoComplete="off"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              multiline
              maxRows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePreviewBtnOnClick}>預覽</Button>
            <Button onClick={handleExportBtnOnClick}>匯出</Button>
          </DialogActions>
        </ExportDialog>
      )}
      {imExportMode === "preview" && (
        <PreviewDialog
          previewFrom={previewFrom}
          encodedData={encodedData}
          handlePreviewDialogCloseBtnOnClick={
            handlePreviewDialogCloseBtnOnClick
          }
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
  ".MuiDialogActions-root": {
    justifyContent: "space-between",
  },
});

const ExportDialog = styled("div")({});
