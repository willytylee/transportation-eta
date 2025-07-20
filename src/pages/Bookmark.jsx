import { useState } from "react";
import { Link } from "react-router-dom";
import { styled, Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { Category } from "../components/Bookmark/Category";
import { BookmarkDialog } from "../components/Settings/BookmarkDialog";
import { dataSet } from "../data/DataSet";
import { getLocalStorage, setLocalStorage } from "../utils/Utils";

export const Bookmark = () => {
  const [bookmarkDialogMode, setBookmarkDialogMode] = useState(null);

  const bookmark = localStorage.getItem("bookmarkV2");
  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;

  let transportData;

  if (bookmark) {
    transportData = getLocalStorage("bookmarkV2");
  } else if (userId) {
    const data = dataSet.find((o) => o.userId === userId);
    setLocalStorage("bookmark", data.transportData);
    transportData = data.transportData;
  }

  const handleEditBookmarkOnClick = () => {
    setBookmarkDialogMode("category");
  };

  return (
    <BookmarkRoot>
      <div className="editBtnWrapper">
        <Button
          variant="text"
          startIcon={<EditIcon fontSize="small" />}
          size="small"
          onClick={handleEditBookmarkOnClick}
        >
          編輯書籤
        </Button>
      </div>
      {bookmark ? (
        transportData?.length > 0 ? (
          transportData?.map((e, i) => <Category key={i} category={e} />)
        ) : (
          <div className="emptyMsg">
            <p>未有書籤。</p>
            <p>
              請先到<Link to="/search">路線搜尋</Link>, 選擇交通路線,
              再選擇巴士站, 然後新增書籤。
            </p>
          </div>
        )
      ) : (
        <div className="emptyMsg">
          <p>未有書籤</p>
          <p>
            現有用戶, 請到<Link to="/settings">設定</Link>, 載入用戶書籤。
          </p>
          <p>
            新用戶, 請先到<Link to="/search">路線搜尋</Link>, 選擇交通路線,
            再選擇巴士站, 然後新增書籤。
          </p>
        </div>
      )}
      <BookmarkDialog
        bookmarkDialogMode={bookmarkDialogMode}
        setBookmarkDialogMode={setBookmarkDialogMode}
      />
    </BookmarkRoot>
  );
};

const BookmarkRoot = styled("div")({
  overflow: "auto",
  ".editBtnWrapper": {
    textAlign: "right",
    ".MuiButton-root": {
      color: "#2f305c",
    },
  },
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
});
