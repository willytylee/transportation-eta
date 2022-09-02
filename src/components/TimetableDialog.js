import { useContext } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  Dialog,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { EtaContext } from "../context/EtaContext";
import { serviceDate } from "../constants/Constants";

export const TimetableDialog = ({
  timetableDialogOpen,
  setTimetableDialogOpen,
}) => {
  const { currRoute } = useContext(EtaContext);
  const handleDialogOnClose = () => {
    setTimetableDialogOpen(false);
  };

  return (
    <DialogRoot
      open={timetableDialogOpen}
      onClose={handleDialogOnClose}
      fullWidth
    >
      <DialogTitle>
        <Grid>
          <div className="title">班次時間表</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogOnClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {currRoute.freq &&
          Object.keys(currRoute.freq).map((date, i) => (
            <div key={i} className="dateWrapper">
              <div className="date">{serviceDate[date]}:</div>
              <div className="timeFreqWrapper">
                {Object.keys(currRoute.freq[date])
                  .sort()
                  .map((startTime, j) => (
                    <div key={j}>
                      {startTime} - {currRoute.freq[date][startTime][0]}:{" "}
                      {currRoute.freq[date][startTime][1] / 60}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </DialogContent>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiDialogContent-root": {
    paddingTop: "20px !important",
    ".dateWrapper": {
      padding: "6px 0",
      ".timeFreqWrapper": {
        fontSize: "14px",
      },
    },
  },
});
