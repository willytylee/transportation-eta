import { useState, useContext } from "react";
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
  Divider,
} from "@mui/material/";
import { useSnackbar } from "notistack";
import {
  Close as CloseIcon,
  Add as AddIcon,
  KeyboardReturn as KeyboardReturnIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";
import { getLocalStorage } from "../../Utils/Utils";
import { companyColor } from "../../constants/Constants";
import { DbContext } from "../../context/DbContext";

export const BookmarkDialog = ({
  fullWidth,
  bookmarkDialogMode,
  setBookmarkDialogMode,
  bookmarkRouteObj,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { gStopList } = useContext(DbContext);
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
    transportData[categoryIdx].data[i].push(bookmarkRouteObj);
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
    enqueueSnackbar(`成功加入路線 ${bookmarkRouteObj.route}`, {
      variant: "success",
    });
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  const handleSectionAddBtnOnClick = () => {
    transportData[categoryIdx].data.push([bookmarkRouteObj]);
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
    enqueueSnackbar(`成功加入路線 ${bookmarkRouteObj.route}`, {
      variant: "success",
    });
    setCategoryIdx(-1);
    setBookmarkDialogMode(null);
  };

  const handleSectionBackBtnOnClick = () => {
    setBookmarkDialogMode("category");
  };

  return (
    <DialogRoot
      onClose={handleDialogCloseBtnOnClick}
      open={bookmarkDialogMode !== null}
      fullWidth={fullWidth}
    >
      {bookmarkDialogMode === "category" && (
        <CategoryRoot>
          <DialogTitle>
            <Grid>
              <div className="title">請選擇類別</div>
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
                    button
                    onClick={() => {
                      handleCategoryItemOnClick(i);
                    }}
                  >
                    <ListItemText
                      primary={e.title}
                      secondary={e.data.map((f, j) => (
                        <span key={j}>
                          {f
                            .map((g, k) => (
                              <span key={k} className={g.co}>
                                {g.route}
                              </span>
                            ))
                            .reduce((a, b) => [a, " + ", b])}
                          <br />
                        </span>
                      ))}
                    />
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
              <div className="title">請選擇組合</div>
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
                  <ListItem button onClick={() => handleSectionItemOnClick(i)}>
                    <ListItemText
                      primary={
                        <li>
                          {e.map((f, j) => (
                            <span key={j}>
                              <span className={`route ${f.co}`}>{f.route}</span>
                              <span className="stopName">
                                {gStopList[f.stopId].name.zh}
                              </span>
                            </span>
                          ))}
                        </li>
                      }
                    />
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

const DialogRoot = styled(Dialog)({
  ".MuiList-root": {
    overflow: "auto",
    paddingTop: "8px",
  },
});

const CategoryRoot = styled("div")({
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
    ".MuiListItemText-primary": {
      width: "70px",
    },
    ".MuiListItemText-secondary": {
      paddingLeft: "8px",
      fontSize: "12px",
      ...companyColor,
    },
  },
});

const CategoryAddRoot = styled("div")({
  ".input": {
    display: "flex",
    padding: "36px 0px 18px 16px",
    ".MuiFormControl-root": {
      flexGrow: 1,
    },
  },
});

const SectionRoot = styled("div")({
  ".MuiListItemText-primary": {
    ".route": {
      display: "inline-block",
      width: "50px",
    },
    ...companyColor,
    ".stopName": {
      fontSize: "12px",
    },
  },
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },
  li: {
    display: "flex",
    flexDirection: "column",
  },
});
