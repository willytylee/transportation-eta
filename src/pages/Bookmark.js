import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material";
import { Category } from "../components/Bookmark/Category";
import { dataSet } from "../data/DataSet";
import { getLocalStorage, setLocalStorage } from "../Utils/Utils";

export const Bookmark = () => {
  const [transportData, setTransportData] = useState([]);

  const bookmark = localStorage.getItem("bookmark");
  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;

  useEffect(() => {
    if (bookmark) {
      const _bookmark = getLocalStorage("bookmark");
      // eslint-disable-next-line no-console
      console.log(_bookmark);
      setTransportData(_bookmark);
    } else if (userId) {
      const data = dataSet.find((o) => o.userId === userId);
      // eslint-disable-next-line no-console
      console.log(data);
      setLocalStorage("bookmark", data.transportData);
      setTransportData(data.transportData);
    }
  }, []);

  return (
    <BookmarkRoot>
      {bookmark ? (
        transportData?.length > 0 ? (
          transportData?.map((e, i) => <Category key={i} category={e} />)
        ) : (
          <div className="emptyMsg">
            <p>未有書籤。</p>
            <p>
              請先到<Link to="/search">路線搜尋</Link>, 選擇巴士路線,
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
            新用戶, 請先到<Link to="/search">路線搜尋</Link>, 選擇巴士路線,
            再選擇巴士站, 然後新增書籤。
          </p>
        </div>
      )}
    </BookmarkRoot>
  );
};

const BookmarkRoot = styled("div")({
  overflow: "auto",
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    paddingTop: "14px",
  },
});
