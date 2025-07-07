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
  <>
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
      <ListRoot sx={{ pt: 0, pb: 0 }}>
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
          <ListItem>
            <ListItemButton
              className="addCategory"
              onClick={handleAddBtnOnClick}
            >
              <AddIcon /> {addLabel}
            </ListItemButton>
          </ListItem>
        )}
      </ListRoot>
    ) : (
      <ListRoot>
        <ListItemButton className="addCategory" onClick={handleAddBtnOnClick}>
          <div>{emptyMsg}</div>
        </ListItemButton>
      </ListRoot>
    )}
  </>
);

const ListRoot = styled(List)({
  ".emptyMsg .MuiListItemText-root .MuiListItemText-primary": {
    width: "100%",
  },
  ".MuiListItemButton-root": {
    paddingRight: "90px !important",
    paddingTop: "3px",
    paddingBottom: "3px",
    "&.addCategory": {
      justifyContent: "center",
      paddingRight: "0px !important",
      paddingLeft: "0px !important",
    },
  },
  ".MuiListItemSecondaryAction-root": {
    button: {
      marginRight: 0,
    },
  },
});
