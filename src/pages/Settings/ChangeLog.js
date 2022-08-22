import { styled, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ChangeLog = () => {
  const navigate = useNavigate();
  return (
    <NewsRoot>
      <div className="subTitle">22/8/2022</div>
      <div className="content">
        <ul>
          <li
            className="underline"
            onClick={() => navigate("/search", { replace: true })}
          >
            加入歷史紀錄功能
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">11/8/2022</div>
      <div className="content">
        <ul>
          <li
            className="underline"
            onClick={() => navigate("/search", { replace: true })}
          >
            加入港鐵搜索功能, 輸入MTR即可顯示所有港鐵路線
          </li>
          <li
            className="underline"
            onClick={() => navigate("/search", { replace: true })}
          >
            加入綠色小巴搜索, 收藏及到站時間排位功能
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">5/8/2022</div>
      <div className="content">
        <ul>
          <li
            className="underline"
            onClick={() => navigate("/news", { replace: true })}
          >
            加入最新交通消息功能。
          </li>
          <li
            className="underline"
            onClick={() => navigate("/settings/update", { replace: true })}
          >
            加入更新應用程式及重新建立路線資料庫功能。
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">31/7/2022</div>
      <div className="content">
        <ul>
          <li
            className="underline"
            onClick={() => navigate("/settings", { replace: true })}
          >
            加入選擇用戶及用戶pin碼功能。
          </li>
          <li
            className="underline"
            onClick={() => navigate("/search", { replace: true })}
          >
            加入搜尋關鍵字路線及附近路線功能。
          </li>
          <li
            className="underline"
            onClick={() => navigate("/weather", { replace: true })}
          >
            加入本港天氣及預報功能。
          </li>
          <li>加入路線地圖功能。</li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">1/7/2022</div>
      <div className="content">
        <ul>
          <li
            className="underline"
            onClick={() => navigate("/search", { replace: true })}
          >
            加入巴士搜索功能
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">29/5/2022</div>
      <div className="content">
        <ul>
          <li>加入巴士, 港鐵收藏及到站時間排位功能。</li>
        </ul>
      </div>
      <DividerRoot />
    </NewsRoot>
  );
};

const NewsRoot = styled("div")({
  padding: "14px",
  overflow: "auto",
  div: {
    marginBottom: "4px",
  },
  ".subTitle": {
    fontSize: "16px",
  },
  ".content": {
    ul: {
      paddingLeft: "25px",
      li: {
        "&.underline": {
          textDecoration: "underline",
        },
      },
    },
  },
});

const DividerRoot = styled(Divider)({
  margin: "8px 0",
});
