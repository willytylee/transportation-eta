import { useState, useEffect } from "react";
import { decompress as decompressJson } from "lzutf8-light";
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

export const ImportExportDialog = ({
  importExportMode,
  setImportExportMode,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [previewFrom, setPreviewFrom] = useState("");
  const [importData, setImportData] = useState("");
  const [exportData, setExportData] = useState("");

  useEffect(() => {
    const bookmark = localStorage.getItem("bookmark") || "W10=";
    setExportData(bookmark);
  }, [localStorage.getItem("bookmark")]);

  const handleDialogCloseBtnOnClick = () => {
    setImportExportMode(null);
  };

  const handleimportBtnOnClick = () => {
    try {
      JSON.parse(
        decompressJson(importData, {
          inputEncoding: "Base64",
        })
      );
      localStorage.setItem("bookmark", importData);
      enqueueSnackbar("成功匯入書籤。", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("資料錯誤, 請重新輸入。", {
        variant: "error",
      });
    }
  };

  const handleExportBtnOnClick = () => {
    try {
      JSON.parse(
        decompressJson(exportData, {
          inputEncoding: "Base64",
        })
      );
      navigator.clipboard.writeText(exportData);
      enqueueSnackbar("已複製資料到剪貼簿, 請妥善保管。", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("資料錯誤, 請重新匯入或刪除書籤。", {
        variant: "error",
      });
    }
  };

  const handleImportPreviewBtnOnClick = () => {
    try {
      JSON.parse(
        decompressJson(importData, {
          inputEncoding: "Base64",
        })
      );
      setPreviewFrom("import");
      setImportExportMode("importPreview");
    } catch (error) {
      enqueueSnackbar("資料錯誤, 請重新輸入。", {
        variant: "error",
      });
    }
  };

  const handleExportPreviewBtnOnClick = () => {
    try {
      JSON.parse(
        decompressJson(exportData, {
          inputEncoding: "Base64",
        })
      );
      setPreviewFrom("export");
      setImportExportMode("exportPreview");
    } catch (error) {
      enqueueSnackbar("資料錯誤, 請重新匯入或刪除書籤。", {
        variant: "error",
      });
    }
  };

  const handleFormChange = (e) => {
    setImportData(e.target.value);
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={importExportMode !== null}
      fullWidth
    >
      {importExportMode === "import" && (
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
              value={importData}
              fullWidth
              multiline
              maxRows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleImportPreviewBtnOnClick}>預覽</Button>
            <Button onClick={handleimportBtnOnClick}>匯入</Button>
          </DialogActions>
        </>
      )}
      {importExportMode === "export" && (
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
              defaultValue={exportData}
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
            <Button onClick={handleExportPreviewBtnOnClick}>預覽</Button>
            <Button onClick={handleExportBtnOnClick}>匯出</Button>
          </DialogActions>
        </ExportDialog>
      )}
      {importExportMode === "importPreview" && (
        <PreviewDialog
          data={importData}
          setImportExportMode={setImportExportMode}
          previewFrom={previewFrom}
        />
      )}
      {importExportMode === "exportPreview" && (
        <PreviewDialog
          data={exportData}
          setImportExportMode={setImportExportMode}
          previewFrom={previewFrom}
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
