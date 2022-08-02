import { useState, useEffect } from "react";
import moment from "moment";
import { fetchNews } from "../fetch/News";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  styled,
} from "@mui/material/";

export const News = () => {
  const [news, setNews] = useState([]);
  useEffect(() => {
    fetchNews().then((response) => setNews(response));
  }, []);

  return (
    <ListRoot>
      {news.map((e) => {
        return (
          <div key={e.content_id}>
            <ListItem disablePadding>
              <ListItemButton
                component={"a"}
                href={`https://www.881903.com/news/traffic/${e.item_id}`}
                target="_blank"
              >
                <ListItemText
                  primary={e.title}
                  secondary={
                    <>
                      <div className="date">
                        {moment.unix(e.display_ts).format("MM月DD日 HH:mm")}
                      </div>
                      <div className="content">
                        {e.preview_content.replace(/【(.*?)】/g, "")}
                      </div>
                    </>
                  }
                />
              </ListItemButton>
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
    ".MuiListItemText-primary": {
      fontSize: "14px",
    },
    ".MuiListItemText-secondary": {
      ".date": {
        fontSize: "10px",
      },
      ".content": {
        fontSize: "12px",
      },
    },
  },
});
