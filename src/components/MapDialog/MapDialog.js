import { useContext } from "react";
import { Dialog, styled } from "@mui/material";
import { EtaContext } from "../../context/EtaContext";
import { Header } from "./Header";
import { Content } from "./Content";

export const MapDialog = ({
  mapDialogOpen,
  handleMapDialogOnClose,
  fullWidth,
}) => {
  const { currRoute, updateMapStopIdx, updateMapLocation } =
    useContext(EtaContext);

  const handleDialogOnClose = () => {
    updateMapStopIdx(-1);
    updateMapLocation(null);
    handleMapDialogOnClose();
  };

  return (
    <DialogRoot
      onClose={handleDialogOnClose}
      open={mapDialogOpen}
      fullWidth={fullWidth}
    >
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
