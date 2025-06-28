import { useContext } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  Dialog,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DbContext } from "../../../context/DbContext";
import { StopGroupList } from "../RouteList/StopGroupList";
import { basicFiltering } from "../../../Utils/Utils";

export const StopNearbyDialog = ({
  nearbyDialogOpen,
  setNearbyDialogOpen,
  stopLatLng,
}) => {
  const { gRouteList } = useContext(DbContext);

  const handleDialogOnClose = () => {
    setNearbyDialogOpen(false);
  };

  const routeKeyList = Object.keys(gRouteList).filter((e) =>
    basicFiltering(gRouteList[e])
  );

  const childStyles = {
    fontSize: "12px",
  };

  return (
    <DialogRoot open={nearbyDialogOpen} onClose={handleDialogOnClose} fullWidth>
      <DialogTitle>
        <Grid>
          <div className="title">附近路線</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogOnClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <StopGroupList
          routeKeyList={routeKeyList}
          currentLocation={stopLatLng}
          childStyles={childStyles}
        />
      </DialogContent>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiDialogContent-root": {
    paddingTop: "20px !important",
    paddingLeft: "0px",
    paddingRight: "0px",
    ".dateWrapper": {
      padding: "6px 0",
      ".timeFreqGroup": {
        fontSize: "14px",
        ".timeFreqWrapper": {
          display: "flex",
          alignItems: "center",
          gap: "28px",
          "&.bold": {
            fontWeight: 900,
          },
        },
      },
    },
  },
});
