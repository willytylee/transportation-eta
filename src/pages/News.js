import { useState, useEffect } from "react";
import moment from "moment";
import { fetchNews } from "../fetch/News";
import { List, ListItem, ListItemText, Divider, styled } from "@mui/material/";

export const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const intervalContent = () => {
      fetchNews().then((response) => setNews(response));
    };

    intervalContent();
    const interval = setInterval(intervalContent, 30000);

    return () => clearInterval(interval);
  }, []);

  const timeFromNowConverter = (display) => {
    moment.updateLocale("en", {
      relativeTime: {
        past: "%s前",
        s: "幾秒",
        ss: "%d秒",
        m: "1分鐘",
        mm: "%d分鐘",
        h: "1小時",
        hh: "%d小時",
        d: "1日",
        dd: "%d日",
      },
    });

    return moment.unix(display).fromNow();
  };

  return (
    <ListRoot>
      {news.map((e) => {
        return (
          <div key={e.content_id}>
            <ListItem disablePadding>
              <ListItemText
                primary={e.title}
                secondary={
                  <span className="secondary">
                    <span className="date">
                      {timeFromNowConverter(e.display_ts)}
                    </span>
                    <span className="content">
                      {e.preview_content.replace(/【(.*?)】/g, "")}
                    </span>
                  </span>
                }
              />
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </ListRoot>
  );
};

const ListRoot = styled(List)({
  overflow: "auto",
  ".MuiListItemText-root": {
    margin: 0,
    padding: "8px 16px",
    ".MuiListItemText-primary": {
      fontSize: "14px",
    },
    ".secondary": {
      display: "flex",
      flexDirection: "column",
      ".date": {
        fontSize: "10px",
      },
      ".content": {
        fontSize: "12px",
      },
    },
  },
});
