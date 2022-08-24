import { styled, Divider } from "@mui/material";
import { Link } from "react-router-dom";

export const ChangeLog = () => (
    <NewsRoot>
      <div className="subTitle">22/8/2022</div>
      <div className="content">
        <ul>
          <li>
            加入<Link to="/search">歷史紀錄</Link>功能
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">11/8/2022</div>
      <div className="content">
        <ul>
          <li>
            加入
            <Link to="/search">港鐵搜索</Link>功能, 輸入MTR即可顯示所有港鐵路線
          </li>
          <li>
            加入<Link to="/search">綠色小巴搜索</Link>功能,
            <Link to="/bookmark">收藏及到站時間排位</Link>功能
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">5/8/2022</div>
      <div className="content">
        <ul>
          <li>
            加入<Link to="/news">最新交通消息</Link>功能。
          </li>
          <li>
            加入
            <Link to="/settings/update">更新應用程式</Link>及
            <Link to="/settings/update">重新建立路線資料庫</Link>功能。
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">31/7/2022</div>
      <div className="content">
        <ul>
          <li>
            加入<Link to="/settings">選擇用戶</Link>及
            <Link to="/settings">用戶pin碼</Link>功能。
          </li>
          <li>
            加入<Link to="/search">搜尋關鍵字路線</Link>及
            <Link to="/search">附近路線</Link>功能。
          </li>
          <li>
            加入<Link to="/weather">本港天氣及預報功能</Link>。
          </li>
          <li>加入路線地圖功能。</li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">1/7/2022</div>
      <div className="content">
        <ul>
          <li>
            加入<Link to="/search">巴士搜索</Link>功能
          </li>
        </ul>
      </div>
      <DividerRoot />
      <div className="subTitle">29/5/2022</div>
      <div className="content">
        <ul>
          <li>
            加入<Link to="/bookmark">巴士, 港鐵收藏及到站時間排位功能</Link>。
          </li>
        </ul>
      </div>
      <DividerRoot />
    </NewsRoot>
  );

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
    },
  },
});

const DividerRoot = styled(Divider)({
  margin: "8px 0",
});
