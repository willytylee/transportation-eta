import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Dialog, styled } from "@mui/material";
import { EtaContext } from "../../context/EtaContext";
import { Header } from "./Header";
import { Content } from "./Content";

export const MapDialog = ({ mapDialogOpen, handleMapDialogOnClose }) => {
  const { updateMapStopIdx, updateMapLocation } = useContext(EtaContext);
  const { routeKey } = useParams();

  const handleDialogOnClose = () => {
    updateMapStopIdx(-1);
    updateMapLocation(null);
    handleMapDialogOnClose();
  };

  return (
    <DialogRoot onClose={handleDialogOnClose} open={mapDialogOpen} fullWidth>
      {routeKey && (
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
