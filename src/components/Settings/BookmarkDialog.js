import { useState } from "react";
import { compress as compressJson } from "lzutf8-light";
import {
  List,
  ListItem,
  Grid,
  IconButton,
  DialogTitle,
  TextField,
  Divider,
  ListItemButton,
} from "@mui/material/";

import {
  Close as CloseIcon,
  Add as AddIcon,
  KeyboardReturn as KeyboardReturnIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { getLocalStorage } from "../../Utils/Utils";
import {
  CategoryAddRoot,
  CategoryRoot,
  DialogRoot,
  SectionRoot,
} from "../../modules/BookmarkDialog";
import { CategoryListItemText } from "../BookmarkDialog/CategoryListItemText";
import { SectionListItemText } from "../BookmarkDialog/SectionListItemText";

export const BookmarkDialog = ({
  bookmarkDialogMode,
  setBookmarkDialogMode,
}) => {
  const [categoryIdx, setCategoryIdx] = useState(-1);
  const [categoryValue, setCategoryValue] = useState("");

  const transportData = getLocalStorage("bookmark") || [];

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

  const handleCategoryAddBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  const handleCategoryAddKeyPress = (e) => {
    e.key === "Enter" && handleCategoryConfirmBtnOnClick();
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
    // transportData[categoryIdx].data[i].push(bookmarkRouteObj);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmark_nocompress",
        JSON.stringify(transportData)
      );
    }

    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  const handleSectionAddBtnOnClick = () => {
    transportData[categoryIdx].data.push([]);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      localStorage.setItem(
        "bookmark_nocompress",
        JSON.stringify(transportData)
      );
    }
  };

  const handleSectionBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth
    >
      {bookmarkDialogMode === "category" && (
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
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
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
              <ListItem button onClick={handleCategoryAddBtnOnClick}>
                <div className="emptyMsg">未有類別, 按此新增類別</div>
              </ListItem>
            </List>
          )}
        </CategoryRoot>
      )}
      {bookmarkDialogMode === "categoryAdd" && (
        <CategoryAddRoot>
          <DialogTitle>
            <Grid>
              <div className="leftBtnGroup">
                <IconButton onClick={handleCategoryAddBackBtnOnClick}>
                  <ArrowBackIosNewIcon />
                </IconButton>
              </div>
              <div className="title">請輸入類別名稱</div>
              <div className="rightBtnGroup">
                <IconButton onClick={handleDialogCloseBtnOnClick}>
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          </DialogTitle>

          <div className="input">
            <TextField
              variant="standard"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
              onKeyPress={(e) => handleCategoryAddKeyPress(e)}
              autoComplete="off"
            />
            <IconButton onClick={handleCategoryConfirmBtnOnClick}>
              <KeyboardReturnIcon />
            </IconButton>
          </div>
        </CategoryAddRoot>
      )}
      {bookmarkDialogMode === "section" && (
        <SectionRoot>
          <DialogTitle>
            <Grid>
              <div className="leftBtnGroup">
                <IconButton onClick={handleSectionBackBtnOnClick}>
                  <ArrowBackIosNewIcon />
                </IconButton>
              </div>
              <div className="title">編輯組合</div>
              <div className="rightBtnGroup">
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
                <div key={i}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton onClick={() => handleSectionItemOnClick(i)}>
                      <SectionListItemText i={i} e={e} />
                    </ListItemButton>
                  </ListItem>
                  {i !== transportData[categoryIdx].data.length - 1 ? (
                    <Divider />
                  ) : null}
                </div>
              ))}
            </List>
          ) : (
            <List sx={{ pt: 0 }}>
              <ListItem button onClick={handleSectionAddBtnOnClick}>
                <div className="emptyMsg">未有組合, 按此新增並加入路線</div>
              </ListItem>
            </List>
          )}
        </SectionRoot>
      )}
    </DialogRoot>
  );
};
