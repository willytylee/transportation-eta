import { useContext, useState } from "react";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
  Dialog,
  ButtonGroup,
  Button,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DbContext } from "../../../context/DbContext";
import { DestGroupList } from "../RouteList/Lightrail/DestGroupList";

export const LrtStationDialog = ({
  lrtStationDialogOpen,
  setLrtStationDialogOpen,
  lrtStopId,
}) => {
  const { gStopList } = useContext(DbContext);
  const [orderMode, setOrderMode] = useState("dest");

  const handleDialogOnClose = () => {
    setLrtStationDialogOpen(false);
  };

  const handleBtnOnClick = (e) => {
    setOrderMode(e.target.value);
  };

  const childStyles = {
    fontSize: "12px",
  };

  return (
    <DialogRoot
      open={lrtStationDialogOpen}
      onClose={handleDialogOnClose}
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle>
        <Grid>
          <div className="title">{gStopList[lrtStopId]?.name.zh}</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleDialogOnClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <ButtonGroup className="btnWrapper">
          <Button
            value="dest"
            onClick={(e) => handleBtnOnClick(e)}
            variant={orderMode === "dest" ? "contained" : "outlined"}
          >
            按目的地分類
          </Button>
          <Button
            value="plat"
            onClick={(e) => handleBtnOnClick(e)}
            variant={orderMode === "plat" ? "contained" : "outlined"}
          >
            按月台分類
          </Button>
          <Button
            value="route"
            onClick={(e) => handleBtnOnClick(e)}
            variant={orderMode === "route" ? "contained" : "outlined"}
          >
            按路線分類
          </Button>
        </ButtonGroup>
        <DestGroupList
          orderMode={orderMode}
          lrtStopId={lrtStopId}
          childStyles={childStyles}
          setLrtStationDialogOpen={setLrtStationDialogOpen}
        />
      </DialogContent>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiDialogContent-root": {
    paddingLeft: "0px",
    paddingRight: "0px",
    ".MuiButton-containedPrimary": {
      backgroundColor: "#2f305cde",
      color: "white",
    },
    ".MuiButton-outlinedPrimary": {
      color: "#2f305c",
      borderColor: "#2f305c",
    },
    ".btnWrapper": {
      display: "flex",
      justifyContent: "center",
      button: {
        fontSize: "12px",
      },
    },
  },
});
