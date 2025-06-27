import { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  Dialog,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DbContext } from "../context/DbContext";
import { serviceDate } from "../constants/Constants";

export const TimetableDialog = ({
  timetableDialogOpen,
  setTimetableDialogOpen,
}) => {
  const { routeKey } = useParams();
  const { gRouteList } = useContext(DbContext);

  const handleDialogOnClose = () => {
    setTimetableDialogOpen(false);
  };

  const d = new Date();
  const day = d.getDay();
  const current = parseInt(d.getHours() + "" + d.getMinutes(), 10);

  const routeData = routeKey ? gRouteList[routeKey] : [];

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
        {routeData &&
          routeData.freq &&
          Object.keys(routeData.freq).length > 0 &&
          Object.keys(routeData.freq).map((date, i) => (
            <div key={i} className="dateWrapper">
              <div className="date">{serviceDate[date]?.string ?? ""}</div>
              <div className="timeFreqGroup">
                {Object.keys(routeData.freq[date])
                  .sort()
                  .map((startTime, j) => {
                    if (routeData.freq[date][startTime] !== null) {
                      const endTime = routeData.freq[date][startTime][0];
                      const interval = routeData.freq[date][startTime][1] / 60;
                      return (
                        <div
                          key={j}
                          className={`timeFreqWrapper ${
                            serviceDate[date]?.day.includes(day) &&
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
                    return <div key={j}>{startTime} - 沒有相關資料</div>;
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
