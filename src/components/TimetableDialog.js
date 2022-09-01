import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  Dialog,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";

export const TimetableDialog = ({
  timetableDialogOpen,
  setTimetableDialogOpen,
}) => {
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
      <DialogContent>test</DialogContent>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({});
