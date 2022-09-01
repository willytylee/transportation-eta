import { useState } from "react";
import { useSnackbar } from "notistack";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  Dialog,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { stationDestMap, stationMap } from "../../constants/Mtr";

export const MtrRouteOptionDialog = ({
  mtrRouteOptionDialogOpen,
  setBookmarkDialogMode,
  bookmarkRouteObj,
  currRoute,
  setBookmarkRouteObj,
  setMtrRouteOptionDialogOpen,
}) => {
  const [bound, setBound] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseBtnOnClick = () => {
    setBound([]);
    setMtrRouteOptionDialogOpen(false);
  };

  const handleFormChange = (e) => {
    let _bound = [...bound];
    if (e.target.checked) {
      _bound.push(e.target.name);
    } else {
      _bound = _bound.filter((f) => f !== e.target.name);
    }
    setBound(_bound);
  };

  const handleConfirmBtnOnClick = () => {
    if (bound.length > 0) {
      setBookmarkRouteObj({ ...bookmarkRouteObj, bound });
      setMtrRouteOptionDialogOpen(false);
      setBookmarkDialogMode("category");
      setBound([]);
    } else {
      enqueueSnackbar("請選擇方向", {
        variant: "error",
      });
    }
  };

  return (
    <DialogRoot
      onClose={handleCloseBtnOnClick}
      open={mtrRouteOptionDialogOpen}
      fullWidth
    >
      <DialogTitle>
        <Grid>
          <div className="title">請選擇方向</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleCloseBtnOnClick}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>

      <FormControl sx={{ m: 3, mb: 0 }} component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={<Checkbox onChange={handleFormChange} name="up" />}
            label={`${stationMap[bookmarkRouteObj.stopId]} → ${stationDestMap[
              currRoute?.route
            ]?.up
              .map((dest) => stationMap[dest])
              .join(" / ")}`}
          />

          <FormControlLabel
            control={<Checkbox onChange={handleFormChange} name="down" />}
            label={`${stationMap[bookmarkRouteObj.stopId]} → ${stationDestMap[
              currRoute?.route
            ]?.down
              .map((dest) => stationMap[dest])
              .join(" / ")}`}
          />
        </FormGroup>
      </FormControl>
      <DialogActions>
        <Button onClick={handleConfirmBtnOnClick}>確定</Button>
      </DialogActions>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".emptyMsg .MuiListItemText-root .MuiListItemText-primary": {
    width: "100%",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
  },
});
