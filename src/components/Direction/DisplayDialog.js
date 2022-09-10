import { useContext } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  Dialog,
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DirectionContext } from "../../context/DirectionContext";

export const DisplayDialog = () => {
  const {
    displayDialogOpen,
    updateDisplayDialogOpen,
    updateDisplayMode,
    displayMode,
  } = useContext(DirectionContext);

  const handleDialogOnClose = () => {
    updateDisplayDialogOpen(false);
  };

  const handleRadioChange = (e) => {
    updateDisplayMode(e.target.value);
  };

  return (
    <DialogRoot
      open={displayDialogOpen}
      onClose={handleDialogOnClose}
      fullWidth
    >
      <DialogTitle>
        <Grid>
          <div className="title">排序方式</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogOnClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>

      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={displayMode}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="只顯示現時有班次路線"
            control={<Radio />}
            label="只顯示現時有班次路線"
          />
          <FormControlLabel
            value="顯示所有路線"
            control={<Radio />}
            label="顯示所有路線"
          />
        </RadioGroup>
      </FormControl>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiFormControl-root": {
    padding: "8px",
    ".MuiFormControlLabel-root": {
      margin: 0,
      padding: "6px 0",
    },
  },
});
