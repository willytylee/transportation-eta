import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material/";
import { dataSet } from "../data/DataSet";

export const SelectUserDialog = ({ handleDialogOnClose, dialogOpen }) => {
  return (
    <Dialog onClose={handleDialogOnClose} open={dialogOpen}>
      <DialogTitle>請選擇用戶:</DialogTitle>
      <List sx={{ pt: 0 }}>
        {dataSet
          .filter((e) => e.display)
          .map((e, i) => (
            <ListItem
              button
              onClick={() =>
                handleDialogOnClose({ user: e.user, name: e.name })
              }
              key={i}
            >
              <ListItemText primary={e.name} />
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
};
