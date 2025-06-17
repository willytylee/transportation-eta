import { useState, useEffect } from "react";
import { Grid, IconButton, DialogTitle, styled, DialogContent, DialogActions, TextField, Button, Dialog } from "@mui/material/";
import { useSnackbar } from "notistack";
import { Close as CloseIcon } from "@mui/icons-material";

export const StationTitleDialog = ({ title, dialogOpen, setDialogOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [stationTitle, setStationTitle] = useState(title);

  useEffect(() => {}, []);

  const handleDialogCloseBtnOnClick = () => {
    setDialogOpen(false);
  };

  const handleConfirmBtnOnClick = () => {
    try {
      localStorage.setItem("stationTitle", stationTitle);
      setDialogOpen(false);
    } catch (error) {
      enqueueSnackbar("資料錯誤, 請重新輸入。", {
        variant: "error",
      });
    }
  };

  const handleFormChange = (e) => {
    setStationTitle(e.target.value);
  };

  return (
    <DialogRoot onClose={handleDialogCloseBtnOnClick} open={dialogOpen} fullWidth>
      <>
        <DialogTitle>
          <Grid>
            <div className="title">自訂車站名稱</div>
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
            label="請輸入車站名稱"
            autoComplete="off"
            onChange={handleFormChange}
            value={stationTitle}
            fullWidth
            multiline
            maxRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmBtnOnClick}>確定</Button>
        </DialogActions>
      </>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
    paddingTop: "8px",
  },
  ".MuiDialogActions-root": {
    justifyContent: "flex-end",
  },
});
