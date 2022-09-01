import { useContext } from "react";
import { Dialog, styled } from "@mui/material";
import { EtaContext } from "../../context/EtaContext";
import { Header } from "./Header";
import { Content } from "./Content";

export const MapDialog = ({ mapDialogOpen, setMapDialogOpen }) => {
  const { currRoute, updateMapStopIdx, updateMapLocation } =
    useContext(EtaContext);

  const handleDialogOnClose = () => {
    updateMapStopIdx(-1);
    updateMapLocation(null);
    setMapDialogOpen(false);
  };

  return (
    <DialogRoot onClose={handleDialogOnClose} open={mapDialogOpen} fullWidth>
      {Object.keys(currRoute).length !== 0 && (
        <>
          <Header handleDialogOnClose={handleDialogOnClose} />
          <Content />
        </>
      )}
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".MuiPaper-root": {
    height: "100%",
    maxWidth: "90%",
    width: "calc(100% - 32px)",
    margin: 0,
  },
});
