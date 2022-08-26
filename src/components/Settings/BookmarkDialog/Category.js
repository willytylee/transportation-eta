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
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { getLocalStorage } from "../../../Utils/Utils";
import { CategoryListItemText } from "../../BookmarkDialog/CategoryListItemText";
import { companyColor } from "../../../constants/Constants";

export const Category = ({
  setCategoryIdx,
  setBookmarkDialogMode,
  handleDialogCloseBtnOnClick,
}) => {
  const transportData = getLocalStorage("bookmark") || [];

  const handleCategoryItemOnClick = (i) => {
    setCategoryIdx(i);
    setBookmarkDialogMode("section");
  };

  const handleCategoryAddBtnOnClick = () => {
    setBookmarkDialogMode("categoryAdd");
  };

  return (
    <CategoryRoot>
      <DialogTitle>
        <Grid>
          <div className="title">編輯類別</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleCategoryAddBtnOnClick}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleDialogCloseBtnOnClick}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      {transportData.length > 0 ? (
        <List sx={{ pt: 0 }}>
          {transportData.map((e, i) => (
            <div key={i}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
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
                    handleCategoryItemOnClick(i);
                  }}
                >
                  <CategoryListItemText e={e} />
                </ListItemButton>
              </ListItem>
              {i !== transportData.length - 1 ? <Divider /> : null}
            </div>
          ))}
        </List>
      ) : (
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleCategoryAddBtnOnClick}>
              <div className="emptyMsg">未有類別, 按此新增類別</div>
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </CategoryRoot>
  );
};

const CategoryRoot = styled("div")({
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },
  ".MuiListItemButton-root": {
    paddingRight: "75px",
    ".MuiListItemText-root": {
      display: "flex",
      alignItems: "center",
      ".MuiListItemText-primary": {
        width: "30%",
      },
      ".MuiListItemText-secondary": {
        width: "70%",
        paddingLeft: "8px",
        fontSize: "12px",
        ...companyColor,
      },
    },
  },
});
