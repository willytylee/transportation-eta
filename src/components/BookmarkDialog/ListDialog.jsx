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
} from "@mui/icons-material";
import { CategoryListItemText } from "./CategoryListItemText";

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
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleItemOnClick(i);
                }}
              >
                {bookmarkDialogMode === "category" && (
                  <CategoryListItemText e={e} />
                )}
              </ListItemButton>
            </ListItem>
            <Divider />
          </div>
        ))}
        <ListItem>
          <ListItemButton className="addCategory" onClick={handleAddBtnOnClick}>
            <AddIcon /> 新增分類
          </ListItemButton>
        </ListItem>
      </ListRoot>
    ) : (
      <ListRoot sx={{ pt: 0, pb: 0 }}>
        <ListItemButton onClick={handleAddBtnOnClick}>
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
    paddingTop: "3px",
    paddingBottom: "3px",
    "&.addCategory": {
      justifyContent: "center",
    },
  },
  ".MuiListItemText-root": {
    ".MuiListItemText-primary": {
      fontSize: "14px",
    },
  },
});
