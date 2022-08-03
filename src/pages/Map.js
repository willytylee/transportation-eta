import { styled } from "@mui/material/";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

export const Map = () => {
  return (
    <MapContainerRoot
      center={[22.324793, 114.16556]}
      zoom={13}
      scrollWheelZoom={false}
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
    </MapContainerRoot>
  );
};

const MapContainerRoot = styled(MapContainer)({
  height: "100%",
});
