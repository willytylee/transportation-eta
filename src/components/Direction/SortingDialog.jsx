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

export const SortingDialog = () => {
  const {
    sortingDialogOpen,
    updateSortingDialogOpen,
    updateSortingMethod,
    sortingMethod,
  } = useContext(DirectionContext);

  const handleDialogOnClose = () => {
    updateSortingDialogOpen(false);
  };

  const handleRadioChange = (e) => {
    updateSortingMethod(e.target.value);
  };

  return (
    <DialogRoot
      open={sortingDialogOpen}
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
          value={sortingMethod}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="最短總時間"
            control={<Radio />}
            label="最短總時間"
          />
          <FormControlLabel
            value="最短步行時間"
            control={<Radio />}
            label="最短步行時間"
          />
          <FormControlLabel
            value="最短交通時間"
            control={<Radio />}
            label="最短交通時間"
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
