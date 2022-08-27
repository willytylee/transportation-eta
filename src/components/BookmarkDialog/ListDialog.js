import {
  List,
  ListItem,
  Grid,
  IconButton,
  DialogTitle,
  Divider,
  ListItemButton,
  styled,
  ListItemText,
} from "@mui/material/";
import {
  Close as CloseIcon,
  Add as AddIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";
import { CategoryListItemText } from "./CategoryListItemText";
import { SectionListItemText } from "./SectionListItemText";

export const ListDialog = ({
  title,
  bookmarkDialogMode,
  handleCloseBtnOnClick,
  handleItemOnClick,
  handleAddBtnOnClick,
  data,
  emptyMsg,
  handleBackBtnOnClick,
}) => (
  <ListDialogRoot>
    <DialogTitle>
      <Grid>
        {handleBackBtnOnClick && (
          <div className="leftBtnGroup">
            <IconButton onClick={handleBackBtnOnClick}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </div>
        )}
        <div className="title">{title}</div>
        <div className="rightBtnGroup">
          <IconButton onClick={handleAddBtnOnClick}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={handleCloseBtnOnClick}>
            <CloseIcon />
          </IconButton>
        </div>
      </Grid>
    </DialogTitle>
    {data.length > 0 ? (
      <List sx={{ pt: 0 }}>
        {data.map((e, i) => (
          <div key={i}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleItemOnClick(i);
                }}
              >
                {bookmarkDialogMode === "category" && (
                  <CategoryListItemText e={e} />
                )}
                {bookmarkDialogMode === "section" && (
                  <SectionListItemText i={i} e={e} />
                )}
              </ListItemButton>
            </ListItem>
            {i !== data.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </List>
    ) : (
      <List sx={{ pt: 0 }}>
        <ListItem className="emptyMsg">
          <ListItemText primary={emptyMsg} />
        </ListItem>
      </List>
    )}
  </ListDialogRoot>
);

const ListDialogRoot = styled("div")({
  ".emptyMsg .MuiListItemText-root .MuiListItemText-primary": {
    width: "100%",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
    ".MuiListItemText-primary": {
      width: "70px",
    },
  },
});
