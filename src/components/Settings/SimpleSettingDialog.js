import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  styled,
  Grid,
  IconButton,
  DialogTitle,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";

export const SimpleSettingDialog = ({
  dialogOpen,
  setDialogOpen,
  dialogTitle,
  dialogOptions,
  dialogKey,
}) => {
  const handleListItemOnClick = (e) => {
    const orig_obj = JSON.parse(localStorage.getItem("settings"));
    const new_obj = { ...orig_obj, [dialogKey]: e };
    localStorage.setItem("settings", JSON.stringify(new_obj));
    setDialogOpen(false);
  };

  return (
    <DialogRoot
      onClose={() => {
        setDialogOpen(false);
      }}
      open={dialogOpen}
      fullWidth
    >
      <>
        <DialogTitle>
          <Grid>
            <div className="title">{dialogTitle}</div>
            <div className="rightBtnGroup">
              <IconButton onClick={() => setDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </Grid>
        </DialogTitle>

        <List sx={{ pt: 0 }}>
          {dialogOptions.map((e, i) => (
            <ListItem
              key={i}
              button
              onClick={() => {
                handleListItemOnClick(e.name);
              }}
            >
              <ListItemIcon>{e.icon}</ListItemIcon>
              <ListItemText primary={e.name} />
            </ListItem>
          ))}
        </List>
      </>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
    paddingTop: "8px",
  },
});
