import { useState } from "react";
import {
  compress as compressJson,
  decompress as decompressJson,
} from "lzutf8-light";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  styled,
  Grid,
  IconButton,
  DialogTitle,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";

export const BookmarkDialog = ({
  fullWidth,
  bookmarkDialogOpen,
  setBookmarkDialogOpen,
  bookmarkRouteObj,
}) => {
  const [categoryIdx, setCategoryIdx] = useState(-1);

  const transportData = JSON.parse(
    decompressJson(localStorage.getItem("bookmark"), {
      inputEncoding: "Base64",
    })
  );

  const handleCategoryItemOnClick = (i) => {
    setCategoryIdx(i);
  };

  const handleSectionItemOnClick = (i) => {
    transportData[categoryIdx].data[i].splice(0, 0, bookmarkRouteObj);
    localStorage.setItem(
      "bookmark",
      compressJson(JSON.stringify(transportData), { outputEncoding: "Base64" })
    );
    setCategoryIdx(-1);
    setBookmarkDialogOpen(false);
  };

  const handleDialogOnClose = () => {
    setCategoryIdx(-1);
    setBookmarkDialogOpen(false);
  };

  return (
    <DialogRoot
      onClose={handleDialogOnClose}
      open={bookmarkDialogOpen}
      fullWidth={fullWidth}
    >
      {categoryIdx === -1 && (
        <>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請選擇類別</div>
              <IconButton onClick={handleDialogOnClose}>
                <CloseIcon />
              </IconButton>
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
                <ListItemText primary={e.title} />
              </ListItem>
            ))}
          </List>
        </>
      )}
      {categoryIdx !== -1 && (
        <>
          <DialogTitle className="dialogTitle">
            <Grid>
              <div className="title">請選擇組合</div>
              <IconButton onClick={handleDialogOnClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </DialogTitle>

          <List sx={{ pt: 0 }}>
            {transportData[categoryIdx].data.map((e, i) => (
              <ListItem
                key={i}
                button
                onClick={() => handleSectionItemOnClick(i)}
              >
                <ListItemText
                  primary={e
                    .map((f, j) => f.route)
                    .reduce((a, b) => [a, " + ", b])}
                />
              </ListItem>
            ))}
          </List>
        </>
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
