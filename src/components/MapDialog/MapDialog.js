import { useContext, useMemo } from "react";
import { Dialog, styled } from "@mui/material";
import { EtaContext } from "../../context/EtaContext";
import { Header } from "./Header";
import { Content } from "./Content";
import { AppContext } from "../../context/AppContext";
import { getLocalStorage } from "../../Utils";

export const MapDialog = ({
  mapDialogOpen,
  handleMapDialogOnClose,
  fullWidth,
}) => {
  const { currRoute, updateMapStopIdx, updateMapLocation } =
    useContext(EtaContext);
  const { dbVersion } = useContext(AppContext);

  const gStopList = useMemo(() => getLocalStorage("stopList"), [dbVersion]);

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
          <Header
            gStopList={gStopList}
            handleDialogOnClose={handleDialogOnClose}
          />
          <Content gStopList={gStopList} />
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
