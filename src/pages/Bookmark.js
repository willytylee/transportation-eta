import { useState, useEffect } from "react";
import { compress as compressJson } from "lzutf8-light";
import { Link } from "react-router-dom";
import { styled } from "@mui/material";
import { Category } from "../components/Bookmark/Category";
import { dataSet } from "../data/DataSet";
import { getLocalStorage } from "../Utils/Utils";

export const Bookmark = () => {
  const [newTransportData, setNewTransportData] = useState([]);

  const bookmark = localStorage.getItem("bookmark");
  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;
  const data = dataSet.find((o) => o.userId === userId);

  useEffect(() => {
    if (bookmark) {
      setNewTransportData(getLocalStorage("bookmark"));
    } else if (userId) {
      localStorage.setItem(
        "bookmark",
        compressJson(JSON.stringify(data.transportData), {
          outputEncoding: "Base64",
        })
      );
      setNewTransportData(data.transportData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmark, userId]);

  return (
    <BookmarkRoot>
      {bookmark ? (
        newTransportData?.map((e, i) => <Category key={i} category={e} />)
      ) : (
        <div className="emptyMsg">
          <p>未有收藏</p>
          <p>
            現有用戶, 請到<Link to="/settings">設定</Link>選擇用戶。
          </p>
          <p>
            新用戶, 請
            <a
              href="https://wa.me/+85267914731"
              target="_blank"
              rel="noreferrer"
            >
              聯絡管理員
            </a>
            。
            {/* 新用戶, 請
            <Link to="/search">路線搜尋</Link>, 選擇巴士站, 然後新增收藏。 */}
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
