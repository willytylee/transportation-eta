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
import { Download as DownloadIcon } from "@mui/icons-material";
import AppIcon from "../../assets/icons/publicTransport.png";

export const Tutorial = () => {
  return (
    <List>
      <ListItem disablePadding className="listItemAppIcon">
        <ListItemButton
          component={"a"}
          href={`https://www.flaticon.com/free-icons/transport`}
          target="_blank"
        >
          <ListItemAvatar>
            <Avatar>
              <DownloadIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="安裝到手機" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
