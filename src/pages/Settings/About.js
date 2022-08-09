import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  styled,
  ListSubheader,
} from "@mui/material/";
import {
  DepartureBoard as DepartureBoardIcon,
  WbSunny as WbSunnyIcon,
  RampRight as RampRightIcon,
  Announcement as AnnouncementIcon,
} from "@mui/icons-material";

export const About = () => {
  return (
    <ListRoot>
      <ListSubheader>第三方資料來源</ListSubheader>
      <ListItem disablePadding>
        <ListItemButton
          component={"a"}
          href={`https://data.gov.hk`}
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <DepartureBoardIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="交通資料來源"
            secondary={"資料一線通  https://data.gov.hk"}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component={"a"}
          href={`https://github.com/hkbus/hk-bus-crawling`}
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <RampRightIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="交通路線 Crawling"
            secondary={
              "HK Bus Crawling@2021, https://github.com/hkbus/hk-bus-crawling"
            }
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component={"a"}
          href={`https://www.hko.gov.hk/en/abouthko/opendata_intro.htm`}
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <WbSunnyIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="天氣資料來源"
            secondary={"香港天文台  https://www.hko.gov.hk"}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component={"a"}
          href={`https://www.881903.com/news/traffic`}
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <AnnouncementIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="交通消息來源"
            secondary={"商業電台 881903  https://www.881903.com/"}
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
});
