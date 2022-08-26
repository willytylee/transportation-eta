import { compress as compressJson } from "lzutf8-light";
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
} from "@mui/icons-material";
import { getLocalStorage } from "../../../Utils/Utils";
import { SectionListItemText } from "../../BookmarkDialog/SectionListItemText";
import { companyColor } from "../../../constants/Constants";

export const Section = ({
  setCategoryIdx,
  setBookmarkDialogMode,
  categoryIdx,
  handleDialogCloseBtnOnClick,
}) => {
  const transportData = getLocalStorage("bookmark") || [];

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
          <ListItem disablePadding>
            <ListItemButton onClick={handleSectionAddBtnOnClick}>
              <div className="emptyMsg">未有組合, 按此新增並加入路線</div>
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </SectionRoot>
  );
};

const SectionRoot = styled("div")({
  ".MuiListItemText-root": {
    display: "flex",
    alignItems: "center",
    ".MuiListItemText-primary": {
      width: "70px",
    },
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
  },
  ".emptyMsg": {
    fontSize: "15px",
    textAlign: "center",
    padding: "20px 0",
  },
});
