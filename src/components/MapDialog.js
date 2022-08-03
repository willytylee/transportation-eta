import { Dialog, styled } from "@mui/material/";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

export const MapDialog = ({
  mapDialogOpen,
  handleMapDialogOnClose,
  fullWidth,
}) => {
  const handleDialogOnClose = () => {
    handleMapDialogOnClose();
  };

  return (
    <DialogRoot
      onClose={() => {
        handleDialogOnClose();
      }}
      open={mapDialogOpen}
      fullWidth={fullWidth}
      className="dialogRoot"
    >
      <MapContainer
        center={[22.324793, 114.16556]}
        zoom={13}
        scrollWheelZoom={false}
        className="mapContainer"
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[22.324793, 114.16556]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[22.325793, 114.16656]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </DialogRoot>
  );
};

const DialogRoot = styled(Dialog)({
  ".title": {
    padding: "16px",
    fontWeight: "900",
    fontSize: "18px",
  },
  ".MuiPaper-root": {
    height: "100%",
    ".mapContainer": {
      height: "100%",
    },
  },
});
