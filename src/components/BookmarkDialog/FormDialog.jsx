import {
  Grid,
  IconButton,
  DialogTitle,
  TextField,
  styled,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material/";
import {
  Close as CloseIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";

export const FormDialog = ({
  title,
  label,
  placeholder,
  value,
  setValue,
  handleDialogCloseBtnOnClick,
  handleBackBtnOnClick,
  handleConfirmBtnOnClick,
  handleAddKeyPress,
}) => (
  <FormDialogRoot>
    <DialogTitle>
      <Grid>
        <div className="leftBtnGroup">
          <IconButton onClick={handleBackBtnOnClick}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </div>
        <div className="title">{title}</div>
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
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => handleAddKeyPress(e)}
        autoComplete="off"
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleConfirmBtnOnClick}>確定</Button>
    </DialogActions>
  </FormDialogRoot>
);

const FormDialogRoot = styled("div")({});
