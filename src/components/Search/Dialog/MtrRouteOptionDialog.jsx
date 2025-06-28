import { useState, useContext } from "react";
import { useSnackbar } from "notistack";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  Dialog,
  FormControl,
  FormControlLabel,
  Radio,
  DialogActions,
  Button,
  RadioGroup,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { stationDestMap, stationMap } from "../../../constants/Mtr";
import { DbContext } from "../../../context/DbContext";

export const MtrRouteOptionDialog = ({
  mtrRouteOptionDialogOpen,
  setBookmarkDialogMode,
  bookmarkData,
  setBookmarkData,
  setMtrRouteOptionDialogOpen,
}) => {
  const { routeKey } = useParams();
  const [bound, setBound] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const { gRouteList } = useContext(DbContext);
  const routeData = routeKey ? gRouteList[routeKey] : [];

  const handleCloseBtnOnClick = () => {
    setBound("");
    setMtrRouteOptionDialogOpen(false);
  };

  const handleFormChange = (e) => {
    setBound(e.target.value);
  };

  const handleConfirmBtnOnClick = () => {
    if (bound !== "") {
      // Find the correct direction routeKey
      const _routeKey = Object.keys(gRouteList)
        .filter((e) => gRouteList[e].route === routeData.route)
        .filter((e) => bound === gRouteList[e].bound.mtr)[0];

      const _bookmarkData = {
        routeKey: _routeKey,
        stopId: bookmarkData.stopId,
      };

      setBookmarkData(_bookmarkData);
      setMtrRouteOptionDialogOpen(false);
      setBookmarkDialogMode("category");
      setBound("");
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
        <RadioGroup value={bound} onChange={handleFormChange}>
          <FormControlLabel
            value="UT"
            control={<Radio />}
            label={`${stationMap[bookmarkData.stopId]} → ${stationDestMap[
              routeData?.route
            ]?.up
              .map((dest) => stationMap[dest])
              .join(" / ")}`}
          />
          <FormControlLabel
            value="DT"
            control={<Radio />}
            label={`${stationMap[bookmarkData.stopId]} → ${stationDestMap[
              routeData?.route
            ]?.down
              .map((dest) => stationMap[dest])
              .join(" / ")}`}
          />
        </RadioGroup>
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
