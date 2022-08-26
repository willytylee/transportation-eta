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
  Edit as EditIcon,
} from "@mui/icons-material";
import { companyColor } from "../../constants/Constants";
import { CategoryListItemText } from "./CategoryListItemText";
import { SectionListItemText } from "./SectionListItemText";

export const ListBtnDialog = ({
  title,
  bookmarkDialogMode,
  handleCloseBtnOnClick,
  handleItemOnClick,
  handleAddBtnOnClick,
  data,
  emptyMsg,
  handleBackBtnOnClick,
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
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
              disablePadding
            >
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
        <ListItem disablePadding>
          <ListItemButton onClick={handleAddBtnOnClick}>
            <div className="emptyMsg">{emptyMsg}</div>
          </ListItemButton>
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
    paddingRight: "115px !important",
    ".MuiListItemText-root": {
      display: "flex",
      alignItems: "center",
      ".MuiListItemText-primary": {
        width: "70px",
      },
      ...(bookmarkDialogMode === "category" && {
        ".MuiListItemText-secondary": {
          flex: 1,
          paddingLeft: "8px",
          fontSize: "12px",
          ...companyColor,
        },
      }),
      ...(bookmarkDialogMode === "section" && {
        ".MuiListItemText-secondary": {
          fontSize: "12px",
          li: {
            display: "flex",
            flexDirection: "column",
            ".route": {
              display: "inline-block",
              width: "50px",
            },
            ...companyColor,
          },
        },
      }),
    },
  },
  ".MuiListItemSecondaryAction-root": {
    button: {
      marginRight: 0,
    },
  },
}));
