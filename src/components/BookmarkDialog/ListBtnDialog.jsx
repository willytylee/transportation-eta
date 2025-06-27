import {
  List,
  ListItem,
  Grid,
  IconButton,
  DialogTitle,
  Divider,
  ListItemButton,
  styled,
} from "@mui/material/";
import {
  Close as CloseIcon,
  Add as AddIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Delete as DeleteIcon,
  DriveFileRenameOutline as DriveFileRenameOutlineIcon,
} from "@mui/icons-material";
import { CategoryListItemText } from "./CategoryListItemText";
import { RouteListItemText } from "./RouteListItemText";

export const ListBtnDialog = ({
  title,
  bookmarkDialogMode,
  handleCloseBtnOnClick,
  handleItemOnClick,
  handleAddBtnOnClick,
  data,
  emptyMsg,
  addLabel,
  handleBackBtnOnClick,
  handleEditBtnOnClick,
  handleDeleteBtnOnClick,
}) => (
  <ListDialogRoot bookmarkDialogMode={bookmarkDialogMode}>
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
            <ListItem
              secondaryAction={
                <>
                  {handleEditBtnOnClick && (
                    <IconButton
                      edge="end"
                      onClick={() => handleEditBtnOnClick(i)}
                    >
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                  )}
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteBtnOnClick(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
              disablePadding
            >
              <ListItemButton
                onClick={() => {
                  handleItemOnClick && handleItemOnClick(i);
                }}
              >
                {bookmarkDialogMode === "category" && (
                  <CategoryListItemText e={e} />
                )}
                {bookmarkDialogMode === "route" && (
                  <RouteListItemText i={i} e={e} />
                )}
              </ListItemButton>
            </ListItem>
            <Divider />
          </div>
        ))}
        {addLabel && (
          <ListItem disablePadding>
            <ListItemButton
              className="addCategory"
              onClick={handleAddBtnOnClick}
            >
              <AddIcon /> {addLabel}
            </ListItemButton>
          </ListItem>
        )}
      </List>
    ) : (
      <List sx={{ pt: 0 }}>
        <ListItemButton onClick={handleAddBtnOnClick}>
          <div>{emptyMsg}</div>
        </ListItemButton>
      </List>
    )}
  </ListDialogRoot>
);

const ListDialogRoot = styled("div")({
  ".emptyMsg .MuiListItemText-root .MuiListItemText-primary": {
    width: "100%",
  },
  ".MuiListItemButton-root.addCategory": {
    justifyContent: "center",
    paddingRight: "0px !important",
    paddingLeft: "0px !important",
  },
  ".MuiListItemButton-root": {
    paddingRight: "90px !important",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
  },
  ".MuiListItemSecondaryAction-root": {
    button: {
      marginRight: 0,
    },
  },
});
