import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  styled,
  Divider,
} from "@mui/material/";
import {
  DepartureBoard as DepartureBoardIcon,
  WbSunny as WbSunnyIcon,
  RampRight as RampRightIcon,
  Announcement as AnnouncementIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const About = () => {
  const navigate = useNavigate();
  return (
    <ListRoot>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() =>
            navigate("/settings/about/changeLog", { replace: true })
          }
        >
          <ListItemAvatar>
            <Avatar>
              <InfoIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            className="newsText"
            primary="最新功能"
            secondary={
              <span>
                加入港鐵搜索功能, 輸入MTR即可顯示所有港鐵路線
                <br />
                加入綠色小巴搜索, 收藏及到站時間排位功能
                <br />
              </span>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://github.com/willytylee/transportation-eta"
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <GitHubIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="原始碼"
            secondary="https://github.com/willytylee/transportation-eta"
          />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://data.gov.hk"
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <DepartureBoardIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="交通資料來源"
            secondary="資料一線通  https://data.gov.hk"
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://github.com/hkbus/hk-bus-crawling"
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <RampRightIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="交通路線整合"
            secondary="HK Bus Crawling@2021, https://github.com/hkbus/hk-bus-crawling"
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://www.hko.gov.hk/en/abouthko/opendata_intro.htm"
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <WbSunnyIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="天氣資料來源"
            secondary="香港天文台  https://www.hko.gov.hk"
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href="https://www.881903.com/news/traffic"
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <AnnouncementIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="交通消息來源"
            secondary="商業電台 881903  https://www.881903.com/"
          />
        </ListItemButton>
      </ListItem>
    </ListRoot>
  );
};

const ListRoot = styled(List)({
  ".MuiListSubheader-root": {
    lineHeight: "18px",
    paddingTop: "20px",
  },
  ".listItemAppIcon": {
    ".MuiAvatar-root": {
      background: "#ffef41",
      img: {
        width: "70%",
      },
    },
  },
  ".newsText": {
    ".MuiListItemText-secondary": {
      fontSize: "12px",
    },
  },
});
