import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  styled,
} from "@mui/material/";
import {
  DepartureBoard as DepartureBoardIcon,
  WbSunny as WbSunnyIcon,
  RampRight as RampRightIcon,
} from "@mui/icons-material";
import AppIcon from "../../assets/icons/publicTransport.png";

export const About = () => {
  return (
    <ListRoot>
      <ListItem disablePadding className="listItemAppIcon">
        <ListItemButton
          component={"a"}
          href={`https://www.flaticon.com/free-icons/transport`}
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <img src={AppIcon} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="圖標來源"
            secondary={"Transport icons created by Freepik - Flaticon"}
          />
        </ListItemButton>
      </ListItem>
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
    </ListRoot>
  );
};

const ListRoot = styled(List)({
  ".listItemAppIcon": {
    ".MuiAvatar-root": {
      background: "#ffef41",
      img: {
        width: "70%",
      },
    },
  },
});
