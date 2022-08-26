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
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { CategoryListItemText } from "./CategoryListItemText";
import { SectionListItemText } from "./SectionListItemText";
import { RouteListItemText } from "./RouteListItemText";

export const ListBtnDialog = ({
  title,
  bookmarkDialogMode,
  handleCloseBtnOnClick,
  handleItemOnClick,
  handleAddBtnOnClick,
  data,
  emptyMsg,
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
          {handleAddBtnOnClick && (
            <IconButton onClick={handleAddBtnOnClick}>
              <AddIcon />
            </IconButton>
          )}
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
                      <EditIcon />
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
                {bookmarkDialogMode === "section" && (
                  <SectionListItemText i={i} e={e} />
                )}
                {bookmarkDialogMode === "route" && (
                  <RouteListItemText i={i} e={e} />
                )}
              </ListItemButton>
            </ListItem>
            {i !== data.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </List>
    ) : (
      <List sx={{ pt: 0 }}>
        <ListItem>
          <ListItemText primary={emptyMsg} />
        </ListItem>
      </List>
    )}
  </ListDialogRoot>
);

const ListDialogRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "bookmarkDialogMode",
})(({ bookmarkDialogMode }) => ({
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },

  ".MuiListItemButton-root": {
    ...(bookmarkDialogMode === "category" && {
      paddingRight: "115px !important",
    }),
    ...(bookmarkDialogMode === "section" && {
      paddingRight: "75px !important",
    }),
    ".MuiListItemText-root": {
      display: "flex",
      alignItems: "center",
      ".MuiListItemText-primary": {
        width: "70px",
      },
    },
  },
  ".MuiListItemSecondaryAction-root": {
    button: {
      marginRight: 0,
    },
  },
}));
