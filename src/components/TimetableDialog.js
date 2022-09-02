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

  const d = new Date();
  const day = d.getDay();
  const current = parseInt(d.getHours() + "" + d.getMinutes(), 10);

  console.log(current);

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
          Object.keys(currRoute.freq).length > 0 &&
          Object.keys(currRoute.freq).map((date, i) => (
            <div key={i} className="dateWrapper">
              <div className="date">{serviceDate[date].string}:</div>
              <div className="timeFreqGroup">
                {Object.keys(currRoute.freq[date])
                  .sort()
                  .map((startTime, j) => {
                    if (currRoute.freq[date][startTime] !== null) {
                      const endTime = currRoute.freq[date][startTime][0];
                      const interval = currRoute.freq[date][startTime][1] / 60;
                      return (
                        <div
                          key={j}
                          className={`timeFreqWrapper ${
                            serviceDate[date].day.includes(day) &&
                            parseInt(startTime, 10) < current &&
                            parseInt(endTime, 10) > current
                              ? "bold"
                              : ""
                          }`}
                        >
                          <div className="timeRange">
                            {startTime} - {endTime}
                          </div>
                          <div className="interval">{interval}分鐘</div>
                        </div>
                      );
                    }
                    return "沒有相關資料";
                  })}
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
      ".timeFreqGroup": {
        fontSize: "14px",
        ".timeFreqWrapper": {
          display: "flex",
          alignItems: "center",
          gap: "28px",
          "&.bold": {
            fontWeight: 900,
          },
        },
      },
    },
  },
});
