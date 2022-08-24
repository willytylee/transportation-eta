import { useState } from "react";
import { compress as compressJson } from "lzutf8-light";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  styled,
  Grid,
  IconButton,
  DialogTitle,
  TextField,
} from "@mui/material/";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { getLocalStorage } from "../../Utils";

export const BookmarkDialog = ({
  fullWidth,
  bookmarkDialogMode,
  setBookmarkDialogMode,
  bookmarkRouteObj,
}) => {
  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [categoryValue, setCategoryValue] = useState("");

  const transportData = getLocalStorage("bookmark");

  // -------------- Close Btn --------------------

  const handleDialogCloseBtnOnClick = () => {
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  // -------------- Category Dialog --------------------

  const handleCategoryItemOnClick = (i) => {
    setCategoryIdx(i);
    setBookmarkDialogMode("section");
  };

  const handleCategoryAddBtnOnClick = () => {
    setBookmarkDialogMode("categoryAdd");
  };

  const handleCategoryConfirmBtnOnClick = () => {
    transportData.push({
      title: categoryValue,
      data: [],
    });
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    setBookmarkDialogMode("category");
    setCategoryValue("");
  };

  // -------------- Section Dialog --------------------

  const handleSectionItemOnClick = (i) => {
    transportData[categoryIdx].data[i].splice(0, 0, bookmarkRouteObj);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  const handleSectionAddBtnOnClick = () => {
    transportData[categoryIdx].data.push([bookmarkRouteObj]);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth={fullWidth}
    >
      {bookmarkDialogMode === "category" && (
        <CategoryRoot>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請選擇類別</div>
              <div className="btnGroup">
                <IconButton onClick={handleCategoryAddBtnOnClick}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={handleDialogCloseBtnOnClick}>
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          </DialogTitle>

          <List sx={{ pt: 0 }}>
            {transportData.map((e, i) => (
              <ListItem
                key={i}
                button
                onClick={() => {
                  handleCategoryItemOnClick(i);
                }}
              >
                <ListItemText
                  primary={e.title}
                  secondary={e.data.map((f, j) => (
                    <span key={j}>
                      {f.map((g, k) => g.route).join(", ")}
                      <br />
                    </span>
                  ))}
                />
              </ListItem>
            ))}
          </List>
        </CategoryRoot>
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <CategoryAddRoot>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請輸入類別名稱</div>
              <IconButton onClick={handleDialogCloseBtnOnClick}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </DialogTitle>

          <div className="input">
            <TextField
              variant="standard"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
              autoComplete="off"
            />
            <IconButton onClick={handleCategoryConfirmBtnOnClick}>
              <CheckIcon />
            </IconButton>
          </div>
        </CategoryAddRoot>
      )}
      {bookmarkDialogMode === "section" && (
        <SectionRoot>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請選擇組合</div>
              <div className="btnGroup">
                <IconButton onClick={handleSectionAddBtnOnClick}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={handleDialogCloseBtnOnClick}>
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          </DialogTitle>
          {transportData[categoryIdx].data.length > 0 ? (
            <List sx={{ pt: 0 }}>
              {transportData[categoryIdx].data.map((e, i) => (
                <ListItem
                  key={i}
                  button
                  onClick={() => handleSectionItemOnClick(i)}
                >
                  <ListItemText
                    primary={
                      <li>{`${e.map((f, j) => f.route).join(" + ")}`}</li>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <div className="emptyMsg">未有組合</div>
          )}
        </SectionRoot>
      )}
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".dialogTitle": {
    padding: "0",
    ".MuiGrid-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ".title": {
        padding: "16px",
        fontWeight: "900",
        fontSize: "18px",
      },
    },
  },
  ".MuiList-root": {
    overflow: "auto",
  },
});

const CategoryRoot = styled("div")({
  ".MuiButtonBase-root": {
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
  },
});

const CategoryAddRoot = styled("div")({
  ".input": {
    display: "flex",
    padding: "0px 0px 11px 16px",
    ".MuiFormControl-root": {
      flexGrow: 1,
    },
  },
});

const SectionRoot = styled("div")({
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    paddingBottom: "14px",
  },
});
