import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material/";
import { Download as DownloadIcon } from "@mui/icons-material";

export const Tutorial = () => (
  <List>
    <ListItem disablePadding className="listItemAppIcon">
      <ListItemButton
        component="a"
        href="https://www.flaticon.com/free-icons/transport"
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
